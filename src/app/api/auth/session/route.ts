import { verifySession } from "@/modules/auth/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await verifySession();

  return NextResponse.json({ user });
}
