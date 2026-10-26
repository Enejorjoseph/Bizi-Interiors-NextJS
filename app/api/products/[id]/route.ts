import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const configuredCode = process.env.ADMIN_ACCESS_CODE;
  if (!configuredCode || request.cookies.get("bisi_admin_access")?.value !== configuredCode) {
    return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  }
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("products").delete().eq("id", context.params.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not delete product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
