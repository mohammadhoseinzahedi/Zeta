import "server-only";

import { Role } from "@prisma/client";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type AuthenticatedUser = {
  id: string;
  username: string;
  role: Role;
  name: string | null;
  image: string | null;
};

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function signJWT(payload: AuthenticatedUser) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h") // Token expires in 2 hours
    .sign(SECRET);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as AuthenticatedUser;
  } catch (error) {
    return null;
  }
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return null;
    }

    // Verify using the jose-based function created earlier
    const payload = await verifyJWT(token);

    if (!payload || !payload.role || !payload.username) {
      return null;
    }

    return {
      id: payload.id,
      username: payload.username,
      role: payload.role,
      name: payload.name,
      image: payload.image,
    };
  } catch (error) {
    console.error("Authentication extraction failed:", error);
    return null;
  }
}
