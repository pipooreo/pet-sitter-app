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

    const { publicUrls } = await req.json();
    console.log("Public URLs from request:", publicUrls);

    if (!publicUrls || !Array.isArray(publicUrls)) {
      throw new Error("No valid public URLs provided");
    }

    const sitter_id = token.id;

    const queryText = `
      INSERT INTO sitter_galleries (pet_sitter_profile_id, img)
      VALUES ${publicUrls.map((_, i) => `($1, $${i + 2})`).join(", ")}
      RETURNING *;
    `;
    
    const queryValues = [sitter_id, ...publicUrls];

    const { rows } = await connectionPool.query(queryText, queryValues);

    return new Response(
      JSON.stringify({
        message: "Images saved successfully.",
        data: rows,
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
