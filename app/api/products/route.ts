import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

function isAdmin(request: NextRequest) {
  const configuredCode = process.env.ADMIN_ACCESS_CODE;
  return Boolean(configuredCode && request.cookies.get("bisi_admin_access")?.value === configuredCode);
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("id,name,category,category_id,image_url,is_featured,is_available,price,created_at")
      .eq("is_available", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ products: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load products.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const imageData = typeof body.imageData === "string" ? body.imageData : "";
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0 || price > 9999999999.99) return NextResponse.json({ error: "Enter a valid price of ₦0 or more." }, { status: 400 });
    if (!name || !category) return NextResponse.json({ error: "Product name and category are required." }, { status: 400 });
    if (!imageData.startsWith("data:image/")) return NextResponse.json({ error: "Please upload a product image." }, { status: 400 });

    const match = imageData.match(/^data:(image\/(?:png|jpeg|jpg|webp|gif));base64,(.+)$/);
    if (!match) return NextResponse.json({ error: "Use a PNG, JPG, WEBP, or GIF image." }, { status: 400 });
    const mime = match[1] === "image/jpg" ? "image/jpeg" : match[1];
    const ext = mime.split("/")[1] === "jpeg" ? "jpg" : mime.split("/")[1];
    const buffer = Buffer.from(match[2], "base64");
    if (buffer.length > 5 * 1024 * 1024) return NextResponse.json({ error: "Image must be 5 MB or smaller." }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const path = `${randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(path, buffer, { contentType: mime, upsert: false });
    if (uploadError) throw uploadError;
    const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(path);

    const { data, error } = await supabase.from("products").insert({
      name, category, price, image_url: publicUrl.publicUrl, is_featured: Boolean(body.featured), is_available: true
    }).select("id,name,category,image_url,is_featured,is_available,price,created_at").single();
    if (error) {
      await supabase.storage.from("product-images").remove([path]);
      throw error;
    }
    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
