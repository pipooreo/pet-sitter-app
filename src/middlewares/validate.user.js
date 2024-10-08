import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import isLength from "validator/lib/isLength";
import matches from "validator/lib/matches";
import { NextResponse } from "next/server";

export async function validateUser(req) {
  const { email, phone, password } = await req.json();

  if (!email.trim() || !phone.trim() || !password.trim()) {
    return NextResponse.json(
      { error: "Email, phone, and password are required." },
      { status: 400 }
    );
  }

  if (!isEmail(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  if (!isMobilePhone(phone, "th-TH")) {
    return NextResponse.json(
      { error: "Invalid phone number format" },
      { status: 400 }
    );
  }

  if (!isLength(password, { min: 12 })) {
    return NextResponse.json(
      { error: "Password must be at least 12 characters long" },
      { status: 400 }
    );
  }

  const passwordComplexityPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
  if (!matches(password, passwordComplexityPattern)) {
    return NextResponse.json(
      {
        error:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
      { status: 400 }
    );
  }

  return NextResponse.next();
}
