import { NextRequest, NextResponse } from 'next/server';

export function authMiddleware(request: NextRequest) {
  const role = request.cookies.get('role')?.value;

  if (!role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (role === 'admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  } else {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/admin-page/:path*'],
};
