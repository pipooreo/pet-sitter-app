import { NextResponse } from 'next/server';
import connectionPool from '@/lib/db';
import bcrypt from 'bcrypt';

function normalizePhoneNumber(phone) {
  if (phone.startsWith('+66')) {
    return phone.replace('+66', '0');
  }
  return phone;
}

export async function POST(req) {
  try {
    const { email, phone, password } = await req.json();

    const normalizedPhone = normalizePhoneNumber(phone);

    const checkEmailResult = await connectionPool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (checkEmailResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'This email is already in use.' },
        { status: 400 }
      );
    }

    const checkPhoneResult = await connectionPool.query(
      'SELECT * FROM users WHERE phone = $1',
      [normalizedPhone]
    );

    if (checkPhoneResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'This phone number is already in use.' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await connectionPool.query(
      `
          INSERT INTO users (email, phone, password)
          VALUES ($1, $2, $3)
          RETURNING *;
        `,
      [email, normalizedPhone, hashedPassword]
    );
    const user = result.rows[0];

    return NextResponse.json(
      { message: 'User registered successfully', user },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
