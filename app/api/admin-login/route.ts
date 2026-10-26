import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const configuredCode = process.env.ADMIN_ACCESS_CODE;

  if (!configuredCode) {
    return NextResponse.json(
      { error: "Admin access code is not configured. Add ADMIN_ACCESS_CODE to .env.local and restart the server." },
      { status: 500 }
    );
  }

  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter the admin code." }, { status: 400 });
  }

  if (!body.code || body.code !== configuredCode) {
    return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("bisi_admin_access", configuredCode, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function GET(request: NextRequest) {
  const configuredCode = process.env.ADMIN_ACCESS_CODE;
  const cookieCode = request.cookies.get("bisi_admin_access")?.value;
  return NextResponse.json({ authenticated: Boolean(configuredCode && cookieCode === configuredCode) });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("bisi_admin_access", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
