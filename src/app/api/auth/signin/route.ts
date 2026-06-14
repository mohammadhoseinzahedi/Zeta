import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignInSchema } from "@/schema/auth";
import { signJWT } from "@/lib/auth";
import { User } from "@prisma/client";

async function generateAuthToken(user: User) {
  return await signJWT({
    id: user.id,
    username: user.username,
    role: user.role,
  });
}

function responseWithAuthCookie(response: NextResponse, token: string) {
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 2, // 2 hours
    path: "/",
  });

  return response;
}

export async function POST(request: Request) {
  try {
    const { username, password } = await SignInSchema.parseAsync(
      await request.json(),
    );

    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      // Sign-up process
      const hashedPassword = await bcrypt.hash(password, 10);
      const role =
        process.env.OWNER_USERNAME === username &&
        process.env.OWNER_PASSWORD === password
          ? "OWNER"
          : "USER";
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          role,
        },
      });

      const token = await generateAuthToken(user);

      return responseWithAuthCookie(
        NextResponse.json(
          { message: "New Account logged in successfully" },
          { status: 201 },
        ),
        token,
      );
    }

    if (user.password && (await bcrypt.compare(password, user.password))) {
      const token = await generateAuthToken(user);

      return responseWithAuthCookie(
        NextResponse.json(
          { message: "Logged in successfully" },
          { status: 200 },
        ),
        token,
      );
    } else {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
