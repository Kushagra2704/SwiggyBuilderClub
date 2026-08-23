import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Reads the current Swiggy token and renders a link + instructions
// so you can transfer it to another device on the same local network.
// Only works when accessed from localhost.
export async function GET(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");

  if (!isLocal) {
    return NextResponse.json({ error: "Only accessible from localhost" }, { status: 403 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("swiggy_token")?.value;
  const expires = cookieStore.get("swiggy_token_expires")?.value;

  if (!token) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:2rem">
        <h2>No Swiggy token found</h2>
        <p>Connect Swiggy on this desktop first, then visit this page.</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  // Build the inject URL using the local IP from the request
  // The phone must use the local network IP, not localhost
  const localIp = request.headers.get("x-forwarded-for") ?? "192.168.1.x";
  const injectUrl = `http://192.168.1.9:3000/api/auth/inject?t=${encodeURIComponent(token)}&e=${expires ?? ""}`;
  const expiresDate = expires ? new Date(parseInt(expires)).toLocaleString("en-IN") : "unknown";

  return new NextResponse(
    `<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Transfer Swiggy Auth</title>
    <style>
      body{font-family:sans-serif;padding:2rem;max-width:600px;margin:auto}
      .url{word-break:break-all;background:#f5f5f5;padding:1rem;border-radius:8px;font-size:0.85rem;margin:1rem 0}
      .btn{display:inline-block;background:#FC8019;color:white;padding:0.75rem 1.5rem;border-radius:8px;text-decoration:none;font-weight:600;margin-top:1rem}
      .note{color:#666;font-size:0.9rem;margin-top:1.5rem}
    </style></head>
    <body>
      <h2>Transfer Swiggy Auth to Phone</h2>
      <p>Token valid until: <strong>${expiresDate}</strong></p>
      <p>Send this URL to your phone (WhatsApp yourself, AirDrop, etc.):</p>
      <div class="url">${injectUrl}</div>
      <p class="note">Opening this URL on your phone will set the auth cookie and redirect to the app. Make sure your phone is on the same WiFi.</p>
    </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
