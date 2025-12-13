import { NextResponse } from "next/server";

export async function POST() {
  console.log("hello from thee server");
  return NextResponse.json({ message: "hello from the server" });
}