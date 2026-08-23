import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
} from "@/lib/pkce";

const SWIGGY_AUTH_URL = "https://mcp.swiggy.com/auth/authorize";
const SWIGGY_DCR_URL = "https://mcp.swiggy.com/auth/register";

async function registerClient(redirectUri: string) {
  const res = await fetch(SWIGGY_DCR_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      redirect_uris: [redirectUri],
      client_name: "Swiggy Concierge",
      grant_types: ["authorization_code"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DCR failed (${res.status}): ${body}`);
  }
  return res.json() as Promise<{ client_id: string }>;
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/callback`;

  try {
    const { client_id } = await registerClient(redirectUri);

    const verifier = generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);
    const state = generateState();

    const cookieStore = await cookies();
    const cookieOpts = {
      httpOnly: true,
      sameSite: "lax" as const,
      maxAge: 600,
    };
    cookieStore.set("pkce_verifier", verifier, cookieOpts);
    cookieStore.set("oauth_state", state, cookieOpts);
    cookieStore.set("oauth_redirect_uri", redirectUri, cookieOpts);

    const params = new URLSearchParams({
      response_type: "code",
      client_id,
      redirect_uri: redirectUri,
      code_challenge: challenge,
      code_challenge_method: "S256",
      state,
      scope: "mcp:tools",
    });

    return Response.redirect(`${SWIGGY_AUTH_URL}?${params}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("OAuth start failed:", message);
    return Response.redirect(
      `${origin}/?auth=error&reason=${encodeURIComponent(message)}`
    );
  }
}
