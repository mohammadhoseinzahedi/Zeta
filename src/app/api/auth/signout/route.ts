import { deleteSession } from "@/modules/auth/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
  await deleteSession();
  return NextResponse.json({ message: "Signed out successfully!" });
}
