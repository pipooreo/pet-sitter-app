import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectionPool from '@/lib/db';
import bcrypt from 'bcrypt';

// สร้างตัวแปร transporter ด้วยข้อมูลการตั้งค่า SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

export async function POST(request) {
  try {
    const { email } = await request.json();

    // ตรวจสอบว่ามีอีเมลอยู่ในฐานข้อมูลหรือไม่
    const checkEmailResult = await connectionPool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (checkEmailResult.rows.length === 0) {
      return NextResponse.json({ error: 'No email valid.' }, { status: 400 });
    }

    // สร้าง OTP 6 หลัก
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // เข้ารหัส OTP ด้วย bcrypt
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    // กำหนดเวลาหมดอายุของ OTP (15 นาที)
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // กำหนดข้อมูลอีเมลที่จะส่ง
    // const mailOptions = {
    //   from: process.env.GMAIL_USER,
    //   to: email,
    //   subject: 'Your OTP Code',
    //   text: `Your OTP code is ${otp}. Use this code to reset your password.`,
    //   html: `<p>Your OTP code is <strong>${otp}</strong>. Use this code to reset your password.</p>
    //   <p>This code is valid for 15 minutes only.</p>
    //   <p>Please click the following link to reset your password:
    //   <a href="http://localhost:3000/password-reset">Reset Password</a></p>`
    // };
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. Use this code to reset your password. This code is valid for 15 minutes only.`,
      html: `<p>Your OTP code is <strong>${otp}</strong>. Use this code to reset your password.</p>
             <p>This code is valid for <span style="color: red;">15 minutes only</span>.</p>
             <p>Please click the following link to reset your password:</p>
             <p><a href="http://localhost:3000/password-reset?email=${encodeURIComponent(
               email
             )}">Reset Password</a></p>`
    };

    // ส่งอีเมล OTP
    await transporter.sendMail(mailOptions);

    // บันทึก OTP ที่เข้ารหัสและเวลาหมดอายุลงในฐานข้อมูล
    await connectionPool.query(
      'UPDATE users SET otp = $1, otp_expires_at = $2 WHERE email = $3',
      [hashedOtp, otpExpiresAt, email]
    );

    return NextResponse.json({ message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Failed to send email.' },
      { status: 500 }
    );
  }
}
