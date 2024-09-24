import { getToken } from "next-auth/jwt";
import { supabase } from "@/lib/supabase.client";
import connectionPool from "@/lib/db";
import { NextResponse } from "next/server";
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

    const userId = token.id;
    const formData = await req.formData();
    const profilePic = formData.get("profilePic");
    const sideImages = formData.getAll("sideImages");
    let profileUrl = "";
    const publicUrls = [];

    // Upload profile image if it exists
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

      // Get public URL for the new profile image
      const { data: profileData } = supabase.storage
        .from("test")
        .getPublicUrl(profileFilePath);
      profileUrl = profileData.publicUrl;
    }
    // Upload side images to bucket
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

      const { data } = supabase.storage.from("test").getPublicUrl(filePath);
      publicUrls.push(data.publicUrl);
    }
    const insertProfileQueryText = `
      INSERT INTO pet_sitter_profiles (user_id,name, experience, profile_image)
      VALUES ($1, $2, $3, $4) RETURNING id;
    `;
    await connectionPool.query(insertProfileQueryText, [
      userId,
      "test",
      2,
      profileUrl,
    ]);
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

    return NextResponse.json({
      message: "Profile created successfully",
      rows: galleryRows,
    });
  } catch (error) {
    console.error("Error in POST route:", error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

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

    const userId = token.id; // Assuming user exists
    const formData = await req.formData();
    const profilePic = formData.get("profilePic");
    const sideImages = formData.getAll("sideImages");
    let profileUrl = "";
    const publicUrls = [];

    // Fetch the current profile image to delete it
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

      // Delete the old profile image
      const { error: deleteError } = await supabase.storage
        .from("test")
        .remove([oldFilePath]);

      if (deleteError) {
        console.error("Error deleting old profile image:", deleteError.message);
      }
    }

    // Upload new profile image if it exists
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

      // Get public URL for the new profile image
      const { data: profileData } = supabase.storage
        .from("test")
        .getPublicUrl(profileFilePath);
      profileUrl = profileData.publicUrl;
    }

    // Upload side images to the bucket
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

      // Get public URL for side image
      const { data } = supabase.storage.from("test").getPublicUrl(filePath);
      publicUrls.push(data.publicUrl);
    }

    // Update profile image
    const updateProfileQueryText = `
      UPDATE pet_sitter_profiles 
      SET profile_image = $1 
      WHERE user_id = $2;
    `;
    await connectionPool.query(updateProfileQueryText, [profileUrl, userId]);

    // Clear the old images in sitter_galleries and insert new images
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

    return NextResponse.json({
      message: "Update successful",
      rows: galleryRows,
    });
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
