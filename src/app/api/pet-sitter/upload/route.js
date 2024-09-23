import { getToken } from "next-auth/jwt";
import connectionPool from "@/lib/db";

export async function POST(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const { publicUrl } = await req.json();
    console.log("Public URL from request:", publicUrl);

    if (!publicUrl) {
      throw new Error("No public URL provided");
    }

    const sitter_id = token.id;

    const { rows } = await connectionPool.query(
      `INSERT INTO sitter_galleries (pet_sitter_profile_id, img) VALUES ($1, $2) RETURNING *`,
      [sitter_id, publicUrl]
    );

    return new Response(
      JSON.stringify({
        message: "Image URL saved successfully.",
        data: rows[0],
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in upload route:", error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
