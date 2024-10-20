import { NextRequest, NextResponse } from 'next/server';

export function profileMiddleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    console.log('No access token found, redirecting to login...');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*'],
};
