
import { NextResponse } from "next/server";
import connectionPool from "@/lib/db";

export async function GET(request, { params }) {
  const target_sitter = params.sitter;

  try {
    const { rows } = await connectionPool.query(
      `SELECT id, created_at, user, review, rating, target_sitter
       FROM ratings_reviews
       WHERE target_sitter = $1`,
      [target_sitter]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
