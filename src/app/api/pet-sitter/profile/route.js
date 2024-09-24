import { NextResponse } from "next/server";
import connectionPool from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { supabase } from "@/lib/supabase.client";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  const token = await getToken({ req, secret });
  // console.log(token);
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const sitter_id = token.id;

  try {
    const { rows } = await connectionPool.query(
      `select 
      u.email, 
      u.phone, p.name, 
      p.profile_image, 
      p.experience, 
      p.id_number, 
      p.birthday, 
      p.introduction, 
      p.trade_name,
      p.place, 
      a.address_detail,
      a.district,
      a.subdistrict,
      a.province,
      a.postcode,
      array_agg(distinct t.type::text) as pet_type, 
      array_agg(distinct t.service) as service,
      array_agg(distinct g.img) as galleries,
      p.status
      from users u
      left join pet_sitter_profiles p on p.user_id = u.id
      left join pet_types t on t.pet_sitter_profile_id = p.id
      left join pet_sitter_addresses a on a.pet_sitter_profile_id = p.id
      left join sitter_galleries g on g.pet_sitter_profile_id = p.user_id
      where u.id = $1 and u.role = 'sitter'
      group by u.email, u.phone, p.name, p.profile_image, p.experience, p.id_number, p.birthday, p.introduction, p.trade_name,
      p.place, a.address_detail, a.district, a.subdistrict, a.province, a.postcode, p.status`,
      [sitter_id]
    );
    if (rows < 1) {
      return NextResponse.json(
        { message: "Not found Pet Sitter" },
        { status: 404 }
      );
    }
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Could not connect to database" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const token = await getToken({ req, secret });
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const sitter_id = token.id;
  const formData = await req.formData();
  const name = formData.get("name");
  const experience = formData.get("experience");
  const trade_name = formData.get("trade_name");
  const introduction = formData.get("introduction");
  const place = formData.get("place");
  const pet_type = formData.getAll("pet_type");
  const service = formData.getAll("service");
  const address_detail = formData.get("address_detail");
  const district = formData.get("district");
  const subdistrict = formData.get("subdistrict");
  const province = formData.get("province");
  const postcode = formData.get("postcode");
  const date = new Date();
  const profilePic = formData.get("profilePic");
  const sideImages = formData.getAll("sideImages");
  const publicUrls = [];
  console.log("Prof -*--*---*-*-", sideImages);
  try {
    await connectionPool.query(
      `update pet_sitter_profiles
      set name = $1, experience = $2, introduction = $3, place = $4, trade_name = $6, updated_at = $7
      where user_id = $5`,
      [name, experience, introduction, place, sitter_id, trade_name, date]
    );

    await connectionPool.query(
      `delete from pet_types where pet_sitter_profile_id = (select id from pet_sitter_profiles where user_id = $1)`,
      [sitter_id]
    );

    for (let i = 0; i < pet_type.length; i++) {
      await connectionPool.query(
        `insert into pet_types (type, service, pet_sitter_profile_id)
        values ($1, $2, (select id from pet_sitter_profiles where user_id = $3))`,
        [pet_type[i], service[i], sitter_id]
      );
    }

    await connectionPool.query(
      `update pet_sitter_addresses set address_detail = $1, district = $2, subdistrict = $3, province = $4, postcode = $5, updated_at = $7
      where pet_sitter_profile_id = (select id from pet_sitter_profiles where user_id = $6)`,
      [
        address_detail,
        district,
        subdistrict,
        province,
        postcode,
        sitter_id,
        date,
      ]
    );

    // profile pic of PUT section
    // console.log(profilePic.size);
    if (profilePic.size > 0) {
      const profileFileExt = profilePic.name.split(".").pop();
      const profileFileName = `${Math.random()}.${profileFileExt}`;
      const profileFilePath = `sitter-profile/${profileFileName}`;
      const { error: profileError } = await supabase.storage
        .from("attachments")
        .upload(profileFilePath, profilePic); // file path (attachments/sitter-profile) ไม่มีก็สร้าง

      if (profileError) {
        throw new Error(
          "Failed to upload profile image: " + profileError.message
        );
      }
      //เอาไฟล์เข้าไปในattachment bucket
      const { data: profileData } = supabase.storage
        .from("attachments")
        .getPublicUrl(profileFilePath); //เอาurlมาเก็บในprofile Data

      let profileUrl = profileData.publicUrl;

      await connectionPool.query(
        `update pet_sitter_profiles set profile_image = $1 where user_id = $2`,
        [profileUrl, sitter_id]
      );
    } else {
      // ไม่มีก็set NULL
      await connectionPool.query(
        `UPDATE pet_sitter_profiles SET profile_image = NULL WHERE user_id = $1;`,
        [sitter_id]
      );
    }

    // sitter galleries part
    console.log("side img--*--*- sitter galleries part PUT", sideImages);
    console.log(
      "side img length--*--*- sitter galleries part PUT",
      sideImages.length
    );
    console.log(
      "side img size --*--*- sitter galleries part PUT",
      sideImages[0].size
    );
    if (sideImages.length >= 1 && sideImages[0].size > 0) {
      for (let i = 0; i < sideImages.length; i++) {
        const file = sideImages[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `sitter-galleries/${fileName}`;

        const { error } = await supabase.storage
          .from("attachments")
          .upload(filePath, file); // ใส่แต่ละไฟล์ไปใน attashments/sitter-galleries
        if (error) {
          throw new Error("Failed to upload side image: " + error.message);
        }
        const { data } = supabase.storage
          .from("attachments")
          .getPublicUrl(filePath); // เอาแต่ละตัวมาpush เข้าpublicUrls
        publicUrls.push(data.publicUrl);
      }
      // console.log("publicUrls >>>>>>>", publicUrls);
      await connectionPool.query(
        `DELETE FROM sitter_galleries WHERE pet_sitter_profile_id = $1;`,
        [sitter_id]
      );
      await connectionPool.query(
        `INSERT INTO sitter_galleries (pet_sitter_profile_id, img)
       VALUES ${publicUrls.map((_, i) => `($1, $${i + 2})`).join(", ")}`,
        [sitter_id, ...publicUrls] // The first parameter is sitter_id, followed by the publicUrls
      );
    } else {
      // console.log("side image else case");
      await connectionPool.query(
        `DELETE FROM sitter_galleries WHERE pet_sitter_profile_id = $1;`,
        [sitter_id]
      );
      await connectionPool.query(
        `insert into sitter_galleries (pet_sitter_profile_id, img)
         values ($1, null);`,
        [sitter_id]
      );
    }

    return NextResponse.json(
      {
        message: "Updated Pet Sitter profile successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Could not connect to database" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const token = await getToken({ req, secret });
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const sitter_id = token.id;
  const formData = await req.formData();
  const name = formData.get("name");
  const experience = formData.get("experience");
  const trade_name = formData.get("trade_name");
  const introduction = formData.get("introduction");
  const place = formData.get("place");
  const pet_type = formData.getAll("pet_type");
  const service = formData.getAll("service");
  const address_detail = formData.get("address_detail");
  const district = formData.get("district");
  const subdistrict = formData.get("subdistrict");
  const province = formData.get("province");
  const postcode = formData.get("postcode");
  const profilePic = formData.get("profilePic");
  const sideImages = formData.getAll("sideImages");
  const publicUrls = [];
  const date = new Date();
  const status = "Waiting for approve";
  // console.log(formData);

  try {
    await connectionPool.query(
      `insert into pet_sitter_profiles (name, experience, introduction, place, user_id, trade_name, status)
    values ($1, $2, $3, $4, $5, $6, $7)`,
      [name, experience, introduction, place, sitter_id, trade_name, status]
    );

    for (let i = 0; i < pet_type.length; i++) {
      await connectionPool.query(
        `insert into pet_types (type, service, pet_sitter_profile_id)
      values ($1, $2, (select id from pet_sitter_profiles where user_id = $3))`,
        [pet_type[i], service[i], sitter_id]
      );
    }

    await connectionPool.query(
      `insert into pet_sitter_addresses (address_detail, district, subdistrict, province, postcode, pet_sitter_profile_id)
    values ($1, $2, $3, $4, $5, (select id from pet_sitter_profiles where user_id = $6))`,
      [address_detail, district, subdistrict, province, postcode, sitter_id]
    );

    // profile pic of POST section
    if (profilePic.size > 0) {
      const profileFileExt = profilePic.name.split(".").pop();
      const profileFileName = `${Math.random()}.${profileFileExt}`;
      const profileFilePath = `sitter-profile/${profileFileName}`;
      const { error: profileError } = await supabase.storage
        .from("attachments")
        .upload(profileFilePath, profilePic); // ไม่มีก็สร้าง

      if (profileError) {
        throw new Error(
          "Failed to upload profile image: " + profileError.message
        );
      }
      //เอาไฟล์เข้าไปในattachment bucket
      const { data: profileData } = supabase.storage
        .from("attachments")
        .getPublicUrl(profileFilePath); //เอาurlมาเก็บในprofile Data

      let profileUrl = profileData.publicUrl;
      console.log("oporf adta=-==-=", profileData);

      await connectionPool.query(
        `update pet_sitter_profiles set profile_image = $1 where user_id = $2`,
        [profileUrl, sitter_id]
      );
    } else {
      // ไม่มีก็set NULL
      await connectionPool.query(
        `UPDATE pet_sitter_profiles SET profile_image = NULL WHERE user_id = $1;`,
        [sitter_id]
      );
    }

    // sitter galleries of POST section
    console.log("side img--*--*- sitter galleries part POST", sideImages);
    console.log(
      "side img length--*--*- sitter galleries part POST",
      sideImages.length
    );
    console.log(
      "side img size --*--*- sitter galleries part POST",
      sideImages[0].size
    );
    //  sideImages start at 1
    if (sideImages.length >= 1 && sideImages[0].size > 0) {
      console.log("if case");
      for (let i = 0; i < sideImages.length; i++) {
        const file = sideImages[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `sitter-galleries/${fileName}`;

        const { error } = await supabase.storage
          .from("attachments")
          .upload(filePath, file); //อัพโหลดรูปไปทีละรูป
        if (error) {
          throw new Error("Failed to upload side image: " + error.message);
        }

        const { data } = supabase.storage
          .from("attachments")
          .getPublicUrl(filePath);
        publicUrls.push(data.publicUrl); //เอารูปแต่ละรูปที่ออัพโหลดไปมาใช้ใน publicUrls
      }

      await connectionPool.query(
        `insert into sitter_galleries (pet_sitter_profile_id, img)
      VALUES ${publicUrls.map((_, i) => `($1, $${i + 2})`).join(", ")}`,
        [sitter_id, ...publicUrls] // Make sure the first element is sitter_id
      );
    } else {
      console.log("side image POST ELSE CASE");
      await connectionPool.query(
        `insert into sitter_galleries (pet_sitter_profile_id, img)
         values ($1, null);`,
        [sitter_id]
      );
    }

    return NextResponse.json(
      {
        message: "Created Pet Sitter profile successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    // console.error("Database created error:", error);
    return NextResponse.json(
      { error: "Could not connect to database" },
      { status: 500 }
    );
  }
}
