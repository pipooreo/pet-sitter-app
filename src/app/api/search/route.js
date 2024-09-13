import { NextResponse, NextRequest } from "next/server";
import connectionPool from "@/lib/db";
export async function GET(req) {
  const url = new URL(req.url);
  // console.log(url);
  const searchParam = new URLSearchParams(url.searchParams);
  const keyword = searchParam.get("keyword");
  const rating = searchParam.get("rating");
  const type = searchParam.get("type");
  const experience = searchParam.get("experience");
  // console.log(keyword, rating, type, experience);

  //   console.log(searchParam);
  let queryData = `select users.id, name, trade_name, profile_image, array_agg(type::text) as pet_type,array_agg(service) as service, experience from users 
        left join pet_sitter_profiles on users.id = pet_sitter_profiles.user_id
        left join pet_types on pet_sitter_profiles.id = pet_types.pet_sitter_profile_id
        left join sitter_galleries on pet_sitter_profiles.user_id = sitter_galleries.pet_sitter_profile_id
        where role = 'sitter'`;

  let queryParams = [];

  if (keyword) {
    queryData += ` and (name ilike $${
      queryParams.length + 1
    } or trade_name ilike $${queryParams.length + 1})`;
    queryParams.push(`%${keyword}%`);
  }

  // if (rating) {
  //   console.log(rating);
  //   let ratingArray = [];
  //   queryParams.push(`%${rating}%`);
  //   if (rating.length > 1) {
  //     ratingArray = rating.split(",");
  //     for (let rate of ratingArray) {
  //       queryData += ` and rating = $${queryParams.length}`;
  //     }
  //   } else {
  //     queryData += ` and rating = $${queryParams.length}`;
  //   }
  // }

  if (experience) {
    // console.log(experience);
    let experienceData = experience.split(" ");
    // experienceData = experienceData.split("-");
    // console.log(experienceData[0][0], experienceData[0][2]);
    if (experienceData[0].length === 3) {
      queryData += ` and $${
        queryParams.length + 1
      } <= experience and experience <= $${queryParams.length + 2}`;
      queryParams.push(Number(experienceData[0][0]));
      queryParams.push(Number(experienceData[0][2]));
    } else {
      queryData += ` and $${queryParams.length + 1} < experience`;
      queryParams.push(Number(experienceData[0][0]));
    }
  }
  queryData += `
  group by users.id, name, trade_name, profile_image, experience`;
  if (type) {
    // console.log(type);
    let typeArray = [];
    queryData += ` HAVING 1=1`;
    if (type.includes(",")) {
      typeArray = type.split(",");
      // console.log(typeArray);
      typeArray.map((item) => {
        queryData += ` AND EXISTS (
        SELECT 1
        FROM unnest(array_agg(type::text)) AS pet_type
        WHERE pet_type::text ILIKE $${queryParams.length + 1})`;

        queryParams.push(`%${item}%`);
      });
    } else {
      queryData += ` AND EXISTS (
        SELECT 1
        FROM unnest(array_agg(type::text)) AS pet_type
        WHERE pet_type ILIKE $${queryParams.length + 1})`;
      queryParams.push(`%${type}%`);
    }
  }

  queryData += ` order by users.id`;
  // console.log(queryData, queryParams);
  try {
    const result = await connectionPool.query(queryData, queryParams);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server could not connect Database" },
      { status: 500 }
    );
  }
}
