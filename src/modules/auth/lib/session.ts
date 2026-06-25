import "server-only";

import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { Role, User } from "@prisma/client";
import { cookies } from "next/headers";
import { cache } from "react";

export type SessionPayload = {
  id: string;
  username: string;
  role: Role;
} & JWTPayload;

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(SECRET);
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export const verifySession = cache(async () => {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return null;
  }

  return await decrypt(token);
});

export async function createSession(user: User) {
  const token = await encrypt({
    id: user.id,
    username: user.username,
    role: user.role,
  });
  const cookieStore = await cookies();

  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 2, // 2 hours
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}
