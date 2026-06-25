import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignInSchema } from "@/schema/auth";
import { createSession } from "@/modules/auth/lib/session";

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

      await createSession(user);

      return NextResponse.json(
        { message: "New Account signed up and logged in successfully" },
        { status: 201 },
      );
    }

    if (user.password && (await bcrypt.compare(password, user.password))) {
      await createSession(user);

      return NextResponse.json(
        { message: "Logged in successfully" },
        { status: 200 },
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
