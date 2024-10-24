// import { NextRequest, NextResponse } from 'next/server';

// export function adminAdminMiddleware(request: NextRequest) {
//   const role = request.cookies.get('userRole')?.value;
  

//   if (!role) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   if (role === 'admin') {
//     return NextResponse.next();
//   }

//   return NextResponse.redirect(new URL('/', request.url));
// }

// export const config = {
//   matcher: ['/admin-page/:path*'], 
// };


import { NextRequest, NextResponse } from 'next/server';

export function adminAdminMiddleware(request: NextRequest) {
  const userCookie = request.cookies.get('user')?.value ?? '';

  // Если кука 'user' не существует или пустая, перенаправляем на страницу логина
  if (!userCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Парсим куку, содержащую объект пользователя
  try {
    const user = JSON.parse(userCookie);

    // Извлекаем роль пользователя
    const role = user.role;

    // Проверяем роль пользователя
    if (role === 'admin') {
      return NextResponse.next();
    }

    // Если роль не admin, перенаправляем на главную страницу
    return NextResponse.redirect(new URL('/', request.url));
    
  } catch (error) {
    console.error('Ошибка при парсинге куки пользователя:', error);
    // В случае ошибки парсинга куки перенаправляем на страницу логина
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin-page/:path*'],
};
