import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { setSwiggyToken } from "@/lib/swiggy-auth";

const SWIGGY_TOKEN_URL = "https://mcp.swiggy.com/auth/token";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return Response.redirect(
      `${origin}/?auth=error&reason=${encodeURIComponent(error)}`
    );
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;
  const verifier = cookieStore.get("pkce_verifier")?.value;
  const redirectUri = cookieStore.get("oauth_redirect_uri")?.value;

  if (!state || state !== storedState || !code || !verifier || !redirectUri) {
    return Response.redirect(`${origin}/?auth=error&reason=invalid_state`);
  }

  try {
    const res = await fetch(SWIGGY_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        code_verifier: verifier,
        redirect_uri: redirectUri,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Token exchange failed:", res.status, body);
      return Response.redirect(`${origin}/?auth=error&reason=token_exchange`);
    }

    const { access_token, expires_in } = (await res.json()) as {
      access_token: string;
      expires_in?: number;
    };

    await setSwiggyToken(access_token, expires_in ?? 432000);

    cookieStore.delete("pkce_verifier");
    cookieStore.delete("oauth_state");
    cookieStore.delete("oauth_redirect_uri");

    return Response.redirect(`${origin}/?auth=success`);
  } catch (err) {
    console.error("Callback error:", err);
    return Response.redirect(`${origin}/?auth=error&reason=server_error`);
  }
}
