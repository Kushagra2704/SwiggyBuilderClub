import { type NextRequest, NextResponse } from "next/server";

// Accepts a Swiggy token via query param and sets it as a cookie.
// Used to transfer auth from a desktop localhost session to a phone
// on the same local network (where OAuth is not whitelisted).
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get("t");
  const expires = searchParams.get("e");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const maxAge = expires
    ? Math.max(0, Math.floor((parseInt(expires) - Date.now()) / 1000))
    : 60 * 60 * 24 * 5;

  const host = request.headers.get("host") ?? "localhost:3000";
  const response = NextResponse.redirect(`http://${host}/?auth=success`);

  response.cookies.set("swiggy_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  if (expires) {
    response.cookies.set("swiggy_token_expires", expires, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge,
      path: "/",
    });
  }

  return response;
}
