import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
  const apiKey = process.env.GOOGLE_MAP_API_KEY;
  const url = new URL(req.url);
  //   console.log(url);
  const searchParam = new URLSearchParams(url.searchParams);
  const address = searchParam.get("address");
  //   console.log(address);
  try {
    const result = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address,
          key: apiKey,
        },
      }
    );
    if (result.data.status !== "OK") {
      return NextResponse.json(
        result.data,
        {
          message: "Could not get location from Google Cloud",
          details: result.data,
        }
        // { status: 500 }
      );
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: " could not get location form Google Cloud" },
      { status: 500 }
    );
  }
}
