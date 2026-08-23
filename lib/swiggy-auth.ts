import { cookies } from "next/headers";

const TOKEN_COOKIE = "swiggy_token";
const EXPIRES_COOKIE = "swiggy_token_expires";

export async function getSwiggyToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  const expiresAt = cookieStore.get(EXPIRES_COOKIE)?.value;

  if (!token) return null;
  if (expiresAt && Date.now() > parseInt(expiresAt)) return null;

  return token;
}

export async function setSwiggyToken(
  token: string,
  expiresIn: number
): Promise<void> {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + expiresIn * 1000;
  const maxAge = expiresIn;

  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
  });
  cookieStore.set(EXPIRES_COOKIE, String(expiresAt), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
  });
}

export async function clearSwiggyToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
  cookieStore.delete(EXPIRES_COOKIE);
}

export async function isSwiggyConnected(): Promise<boolean> {
  const token = await getSwiggyToken();
  return token !== null;
}
