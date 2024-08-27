import { NextResponse } from "next/server";
import connectionPool from "@/lib/db";
export async function GET() {
  try {
    const result = await connectionPool.query(`select * from users`);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server could not connect Database" },
      { status: 500 }
    );
  }
}
