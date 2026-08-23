import { cookies } from "next/headers";
import { isSwiggyConnected } from "@/lib/swiggy-auth";
import type { AuthStatus } from "@/types";

export async function GET() {
  const connected = await isSwiggyConnected();
  const cookieStore = await cookies();
  const expiresAt = cookieStore.get("swiggy_token_expires")?.value;

  const status: AuthStatus = {
    connected,
    expiresAt: expiresAt ? parseInt(expiresAt) : undefined,
  };

  return Response.json(status);
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("swiggy_token");
  cookieStore.delete("swiggy_token_expires");
  return Response.json({ disconnected: true });
}
