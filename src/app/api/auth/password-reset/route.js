import { NextResponse } from 'next/server';
import connectionPool from '@/lib/db';
import bcrypt from 'bcrypt';

// ใช้ bcrypt สำหรับการเปรียบเทียบ OTP ที่เข้ารหัส
export async function POST(request) {
  try {
    const { email, otp, newPassword } = await request.json();

    // ตรวจสอบข้อมูลที่ส่งมา
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // ดึงข้อมูล OTP ที่เข้ารหัสและเวลาหมดอายุจากฐานข้อมูล
    const result = await connectionPool.query(
      'SELECT otp, otp_expires_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or OTP.' },
        { status: 400 }
      );
    }

    const { otp: hashedOtp, otp_expires_at } = result.rows[0];

    // ตรวจสอบกรณีที่ OTP เป็น NULL
    if (!hashedOtp) {
      return NextResponse.json(
        {
          error: 'You need to request a new OTP before resetting your password.'
        },
        { status: 400 }
      );
    }

    // ตรวจสอบเวลาหมดอายุของ OTP
    if (new Date() > new Date(otp_expires_at)) {
      return NextResponse.json({ error: 'OTP has expired.' }, { status: 400 });
    }

    // เปรียบเทียบ OTP ที่ผู้ใช้กรอกกับ OTP ที่เก็บในฐานข้อมูล
    const isOtpValid = await bcrypt.compare(otp, hashedOtp);

    if (!isOtpValid) {
      return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 });
    }

    // เข้ารหัสรหัสผ่านใหม่
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // อัปเดตรหัสผ่านในฐานข้อมูล
    await connectionPool.query(
      'UPDATE users SET password = $1, otp = NULL, otp_expires_at = NULL WHERE email = $2',
      [hashedPassword, email]
    );

    return NextResponse.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password.' },
      { status: 500 }
    );
  }
}
