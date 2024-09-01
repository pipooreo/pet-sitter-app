// import { validateUser } from "./middlewares/validate.user";
// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";

// export async function middleware(req) {
//   const url = new URL(req.url);

//   // register validate start//
//   if (url.pathname.startsWith("/api/auth/register")) {
//     return validateUser(req);
//   }
//   // register validate end//

//   // ตรวจสอบการเข้าสู่ระบบและจัดการการเปลี่ยนเส้นทางตามบทบาท
//   if (
//     !url.pathname.startsWith("/api/auth/login") &&
//     !url.pathname.startsWith("/login")
//   ) {
//     const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//     if (!token) {
//       // ถ้าไม่มีโทเค็น (ไม่ได้เข้าสู่ระบบ) ให้เปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     // จัดการการเปลี่ยนเส้นทางตามบทบาท
//     if (token.role === "sitter" && !url.pathname.startsWith("/sitter")) {
//       return NextResponse.redirect(new URL("/sitter", req.url));
//     }
//     if (token.role === "owner" && !url.pathname.startsWith("/owner")) {
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//     if (token.role === "admin" && !url.pathname.startsWith("/admin")) {
//       return NextResponse.redirect(new URL("/admin", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/api/auth/register",
//     "/api/auth/login",
//     "/login",
//     "/sitter/:path*", // เพิ่มเส้นทางสำหรับ sitters
//     "/admin/:path*", // เพิ่มเส้นทางสำหรับ admins
//   ],
// };
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = new URL(req.url);

  // ตรวจสอบความถูกต้องสำหรับการลงทะเบียน
  if (url.pathname.startsWith("/api/auth/register")) {
    return validateUser(req);
  }

  // ตรวจสอบการเข้าสู่ระบบและจัดการการเปลี่ยนเส้นทางตามบทบาท
  if (
    !url.pathname.startsWith("/api/auth/login") &&
    !url.pathname.startsWith("/login")
  ) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      // ถ้าไม่มีโทเค็น (ไม่ได้เข้าสู่ระบบ) ให้เปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // จัดการการเปลี่ยนเส้นทางตามบทบาท
    if (token.role === "owner" && url.pathname !== "/") {
      // ถ้าเป็น owner และไม่อยู่ที่หน้า "/" ให้เปลี่ยนเส้นทางไปที่หน้า "/"
      return NextResponse.redirect(new URL("/", req.url));
    }
    // ตัวอย่างการจัดการบทบาทอื่น
    if (token.role === "sitter" && !url.pathname.startsWith("/sitter")) {
      return NextResponse.redirect(new URL("/sitter", req.url));
    }
    if (token.role === "admin" && !url.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/auth/register",
    "/api/auth/login",
    "/sitter/:path*",
    "/admin/:path*",
  ],
};
