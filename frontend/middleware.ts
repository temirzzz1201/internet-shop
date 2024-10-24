import { NextRequest, NextResponse } from 'next/server';
import { adminAdminMiddleware } from './middleware/adminAdminMiddleware';
import { profileMiddleware } from './middleware/profileMiddleware';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin-page')) {
    return adminAdminMiddleware(req);
  } else if (req.nextUrl.pathname.startsWith('/profile')) {
    return profileMiddleware(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/admin-page/:path*'],
};
