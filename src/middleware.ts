import { NextRequest, NextResponse } from 'next/server';

import { verifySesion } from './services/auth.service';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isHome = pathname === '/';
  const access_token = req.cookies.get('access_token');

  if (access_token) {
    const sesion = await verifySesion(access_token.value);

    if (sesion instanceof Error) {
      if (pathname.includes('/panel'))
        return NextResponse.redirect(new URL('/', req.url));

      const res = NextResponse.next();
      res.cookies.delete('access_token');
      return res;
    }

    const { expireIn, userdata } = sesion;

    if (isHome)
      return NextResponse.redirect(new URL('/panel', req.url), {
        headers: {
          'Set-Cookie': `userdata=${encodeURIComponent(JSON.stringify(userdata))}; Expires=${new Date(expireIn).toUTCString()}`,
        },
      });

    const res = NextResponse.next();
    res.cookies.set('userdata', JSON.stringify(userdata), {
      expires: new Date(expireIn),
    });

    return res;
  }

  if (!isHome) return NextResponse.redirect(new URL('/', req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/panel'],
};
