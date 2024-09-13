import { NextResponse } from "next/server";
import connectionPool from "@/lib/db";

export async function GET(request, { params }) {
  const sitter_id = params.sitter;

  try {
    const { rows } = await connectionPool.query(
      `SELECT 
    p.name, 
    p.trade_name, 
    p.introduction,
    p.experience, 
    p.place,
    p.address,
    p.profile_image,
    ARRAY_AGG(s.img) AS images
FROM pet_sitter_profiles p
INNER JOIN sitter_galleries s ON p.user_id = s.pet_sitter_profile_id
WHERE p.user_id = $1
GROUP BY p.name, p.trade_name, p.introduction, p.experience, p.address, p.place, p.profile_image;`,
      [sitter_id]
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
