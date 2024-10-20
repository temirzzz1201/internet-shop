import { NextRequest, NextResponse } from 'next/server';

export function adminAdminMiddleware(request: NextRequest) {
  console.log('Cookies in request:', request.cookies);
  const role = request.cookies.get('userRole')?.value;

  if (!role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (role === 'admin') {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/admin-page/:path*'], 
};
