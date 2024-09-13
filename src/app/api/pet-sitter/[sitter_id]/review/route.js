import { NextResponse } from "next/server";
import connectionPool from "@/lib/db";

export async function GET(request, { params }) {
  const sitter_review = params.sitter_id;

  try {
    const { rows } = await connectionPool.query(
      `select user, created_at, review, rating, target_sitter from ratings_reviews where target_sitter = $1`,
      [sitter_review]
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
