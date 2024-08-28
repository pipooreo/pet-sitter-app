// import validator from 'validator';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import isLength from 'validator/lib/isLength';
import { NextResponse } from 'next/server';

export async function validateUser(req) {
  const { email, phone, password } = await req.json();

  if (!email.trim() || !phone.trim() || !password.trim()) {
    return NextResponse.json(
      { error: 'Email, phone, and password are required.' },
      { status: 400 }
    );
  }

  if (!isEmail(email)) {
    return NextResponse.json(
      { error: 'Invalid email format' },
      { status: 400 }
    );
  }

  if (!isMobilePhone(phone, 'th-TH')) {
    return NextResponse.json(
      { error: 'Invalid phone number format' },
      { status: 400 }
    );
  }

  if (!isLength(password, { min: 12 })) {
    return NextResponse.json(
      { error: 'Password must be at least 12 characters long' },
      { status: 400 }
    );
  }

  return NextResponse.next();
}

// export async function validateUser(data) {
//   const { email, phone, password } = data;

//   if (!email.trim() || !phone.trim() || !password.trim()) {
//     return NextResponse.json(
//       { error: 'Email, phone, and password are required.' },
//       { status: 400 }
//     );
//   }

//   if (!isEmail(email)) {
//     return NextResponse.json(
//       { error: 'Invalid email format' },
//       { status: 400 }
//     );
//   }

//   if (!isMobilePhone(phone, 'th-TH')) {
//     return NextResponse.json(
//       { error: 'Invalid phone number format' },
//       { status: 400 }
//     );
//   }

//   if (!isLength(password, { min: 12 })) {
//     return NextResponse.json(
//       { error: 'Password must be at least 12 characters long' },
//       { status: 400 }
//     );
//   }

//   return null; // ไม่มีข้อผิดพลาด
// }
