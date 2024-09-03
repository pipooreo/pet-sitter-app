import { validateResetPassword } from "./middlewares/validate.reset.password";
import { validateUser } from "./middlewares/validate.user";

export function middleware(req) {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/api/auth/register")) {
    return validateUser(req);
  }
  if (url.pathname.startsWith("/api/auth/password")) {
    return validateResetPassword(req);
  }
}

export const config = {
  matcher: [
    "/api/auth/register",
    "/api/auth/register-pet-sitter",
    "/api/auth/password-reset",
  ],
};
