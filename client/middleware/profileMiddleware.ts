import { NextRequest, NextResponse } from 'next/server';

export function profileMiddleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('TOKEN ', token);

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*'],
};
