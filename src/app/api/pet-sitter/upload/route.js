import { getToken } from "next-auth/jwt";
import { supabase } from "@/lib/supabase.client";
import connectionPool from "@/lib/db";

export async function PUT(req) {
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

    const userId = token.id;
    const formData = await req.formData();
    const profilePic = formData.get("profileImage");
    const sideImages = formData.getAll("sideImages");
    let profileUrl = "";
    const publicUrls = [];

    // เช็คว่ามีรูปโปรไฟล์ยัง มีก็ลบ
    const existingProfileQuery = `
      SELECT profile_image FROM pet_sitter_profiles WHERE user_id = $1;
    `;
    const existingProfileResult = await connectionPool.query(
      existingProfileQuery,
      [userId]
    );
    if (existingProfileResult.rowCount > 0) {
      const oldProfileImageUrl = existingProfileResult.rows[0].profile_image;
      const oldFilePath = oldProfileImageUrl.split("/").pop(); // Get the file name from the URL

      const { error: deleteError } = await supabase.storage
        .from("test")
        .remove([oldFilePath]);

      if (deleteError) {
        console.error("Error deleting old profile image:", deleteError.message);
      }
    }

    // ใส่รูปโปรไฟล์
    if (profilePic) {
      const profileFileExt = profilePic.name.split(".").pop();
      const profileFileName = `${Math.random()}.${profileFileExt}`;
      const profileFilePath = `profiles/${profileFileName}`;

      const { error: profileError } = await supabase.storage
        .from("test")
        .upload(profileFilePath, profilePic);

      if (profileError) {
        throw new Error(
          "Failed to upload profile image: " + profileError.message
        );
      }

      // เอาลิ้งรูปมาจากbucketเพื่อใช้ใส่ในprofilepic
      const { data: profileData } = supabase.storage
        .from("test")
        .getPublicUrl(profileFilePath);
      profileUrl = profileData.publicUrl;
    }

    // ใส่รูปside img ในbucket
    for (let i = 0; i < sideImages.length; i++) {
      const file = sideImages[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `side-images/${fileName}`;

      const { error } = await supabase.storage
        .from("test")
        .upload(filePath, file);
      if (error) {
        throw new Error("Failed to upload side image: " + error.message);
      }

      // เอาลิ้งรูปมาจากbucketเพื่อใช้ใส่ในpet_sitter_profiles
      const { data } = supabase.storage.from("test").getPublicUrl(filePath);
      publicUrls.push(data.publicUrl);
    }

    // อัพเดทprofile pic
    const updateProfileQueryText = `
      UPDATE pet_sitter_profiles 
      SET profile_image = $1 
      WHERE user_id = $2;
    `;
    await connectionPool.query(updateProfileQueryText, [profileUrl, userId]);

    // ]ลบรูปเก่าในsitter_galleriesแล้วใส่รูปใหม่ทั้งหมด
    const deleteGalleryQueryText = `
      DELETE FROM sitter_galleries WHERE pet_sitter_profile_id = $1;
    `;
    await connectionPool.query(deleteGalleryQueryText, [userId]);

    const galleryQueryText = `
      INSERT INTO sitter_galleries (pet_sitter_profile_id, img)
      VALUES ${publicUrls.map((_, i) => `($1, $${i + 2})`).join(", ")}
      RETURNING *;
    `;
    const galleryQueryValues = [userId, ...publicUrls];
    const { rows: galleryRows } = await connectionPool.query(
      galleryQueryText,
      galleryQueryValues
    );

    return new Response(
      JSON.stringify({
        message: "Profile and images updated successfully.",
        userId,
        gallery: galleryRows,
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
