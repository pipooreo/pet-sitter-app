import { NextResponse, NextRequest } from "next/server";
import connectionPool from "@/lib/db";
export async function GET(req) {
  const url = new URL(req.url);
  console.log(url);
  const searchParam = new URLSearchParams(url.searchParams);
  const keyword = searchParam.get("keyword");
  const rating = searchParam.get("rating");
  const type = searchParam.get("type");
  const experience = searchParam.get("experience");
  console.log(keyword, rating, type, experience);

  //   console.log(searchParam);
  let queryData = `select users.id, name, trade_name, profile_image, pet_type, experience from users 
        left join pet_sitter_profiles
        on users.id = pet_sitter_profiles.user_id
        where role = 'sitter'`;

  let queryParams = [];

  if (keyword) {
    queryData += ` and name ilike $1 or trade_name ilike $${
      queryParams.length + 1
    }`;
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

  if (type) {
    // console.log(type);
    let typeArray = [];
    if (type.includes(",")) {
      typeArray = type.split(",");
      // console.log(typeArray);
      typeArray.map((item, index) => {
        if (index === 0) {
          queryData += ` and pet_type ilike $${queryParams.length + 1}`;
        } else {
          queryData += ` or pet_type ilike $${queryParams.length + 1}`;
        }
        queryParams.push(`%${item}%`);
      });
    } else {
      queryData += ` and pet_type ilike $${queryParams.length + 1}`;
      queryParams.push(`%${type}%`);
    }
  }

  if (experience) {
    // console.log(experience);
    queryData += ` and experience = $${queryParams.length + 1}`;
    queryParams.push(Number(experience));
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
