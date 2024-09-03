import { validateResetPassword } from "./middlewares/validate.reset.password";
import { validateUser } from "./middlewares/validate.user";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = new URL(req.url);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // register validate start//
  if (url.pathname.startsWith("/api/auth/register")) {
    return validateUser(req);
  }
  if (url.pathname.startsWith("/api/auth/password")) {
    return validateResetPassword(req);
  }
  if (!token) {
    // ป้องกันไม่ให้เข้าถึงหน้า /sitter หรือ /admin ถ้าไม่มี token
    if (
      url.pathname.startsWith("/sitter") ||
      url.pathname.startsWith("/admin")
    ) {
      return NextResponse.redirect(new URL("/", url.origin));
    }
    return NextResponse.next();
  }

  if (url.pathname === "/login" || url.pathname === "/register") {
    // แบ่งการ redirect ตาม role ของผู้ใช้
    if (token.role === "owner") {
      return NextResponse.redirect(new URL("/", url.origin));
    } else if (token.role === "sitter") {
      return NextResponse.redirect(new URL("/sitter", url.origin));
    } else if (token.role === "admin") {
      return NextResponse.redirect(new URL("/admin", url.origin));
    }
  }

  // เงื่อนไขอื่น ๆ สำหรับการตรวจสอบ role และ redirect
  if (token.role === "owner" && url.pathname !== "/") {
    return NextResponse.redirect(new URL("/", url.origin));
  }
  if (token.role === "sitter" && !url.pathname.startsWith("/sitter")) {
    return NextResponse.redirect(new URL("/sitter", url.origin));
  }
  if (token.role === "admin" && !url.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin", url.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/auth/register",
    "/api/auth/login",
    "/api/auth/register-pet-sitter",
    "/api/auth/password-reset",
    "/sitter/:path*",
    "/admin/:path*",
    "/login/:path*",
    "/register",
    "/",
  ]
