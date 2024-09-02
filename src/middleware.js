import { validateUser } from './middlewares/validate.user';

export function middleware(req) {
  const url = new URL(req.url);

  // register validate start//
  if (url.pathname.startsWith('/api/auth/register')) {
    return validateUser(req);
  }
  // register validate end//
}

export const config = {
  matcher: [
    '/api/auth/register',
    '/api/auth/login',
    '/api/auth/register-pet-sitter'
  ]
};
