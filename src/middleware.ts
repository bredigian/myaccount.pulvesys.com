import { NextRequest, NextResponse } from 'next/server';

import { verifySesion } from './services/auth.service';

export const credentials = 'include';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isHome = pathname === '/';

  const access_token = req.cookies.get('access_token');
  const refresh_token = req.cookies.get('refresh_token');

  if (access_token && refresh_token) {
    const sesion = await verifySesion(access_token.value, refresh_token);

    if ('error' in sesion) {
      if (pathname.includes('/panel'))
        return NextResponse.redirect(new URL('/', req.url));

      const res = NextResponse.next();
      res.cookies.delete('access_token');
      res.cookies.delete('refresh_token');
      res.cookies.delete('userdata');

      return res;
    }

    if (isHome) return NextResponse.redirect(new URL('/panel', req.url));

    return NextResponse.next();
  }

  if (!isHome) return NextResponse.redirect(new URL('/', req.url));
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/panel',
    '/panel/productos',
    '/panel/tratamiento',
    '/panel/campos',
    '/panel/cultivos&tratamientos',
  ],
};
