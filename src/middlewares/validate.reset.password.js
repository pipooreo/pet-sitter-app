import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import matches from "validator/lib/matches";
import { NextResponse } from "next/server";

export async function validateResetPassword(req) {
  const { email, otp, newPassword } = await req.json();

  if (!email.trim() || !otp || !newPassword.trim()) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  if (otp.length !== 6) {
    return NextResponse.json({ error: "Invalid otp" }, { status: 400 });
  }

  if (!isEmail(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  if (!isLength(newPassword, { min: 12 })) {
    return NextResponse.json(
      { error: "Password must be at least 12 characters long" },
      { status: 400 }
    );
  }

  const passwordComplexityPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
  if (!matches(newPassword, passwordComplexityPattern)) {
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
