import { NextRequest, NextResponse } from 'next/server';

export function adminMiddleware(request: NextRequest) {
  const userCookie = request.cookies.get('user')?.value ?? '';

  if (!userCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const user = JSON.parse(userCookie);
    const role = user.role;

    if (role === 'admin') {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Ошибка при парсинге куки пользователя:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin-page/:path*'],
};
