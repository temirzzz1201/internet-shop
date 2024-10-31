import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from './middleware/adminMiddleware';
import { profileMiddleware } from './middleware/profileMiddleware';
import { busketMiddleware } from './middleware/busketMiddleware';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin-page')) {
    return adminMiddleware(req);
  } else if (req.nextUrl.pathname.startsWith('/profile')) {
    return profileMiddleware(req);
  } else if (req.nextUrl.pathname.startsWith('/busket')) {
    return busketMiddleware(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/admin-page/:path*', '/busket/:path*'],
};
