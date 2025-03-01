import { NextRequest, NextResponse } from 'next/server';

import { verifySesion } from './services/auth.service';
import { Hostname, TEnvironment } from './types/environment.types';

export const credentials = 'include';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isHome = pathname === '/';

  const access_token = req.cookies.get('access_token');
  const refresh_token = req.cookies.get('refresh_token');

  if (access_token && refresh_token) {
    const sesion = await verifySesion(access_token.value, refresh_token);

    if (sesion instanceof Error) {
      if (pathname.includes('/panel'))
        return NextResponse.redirect(new URL('/', req.url));

      const res = NextResponse.next();
      res.cookies.delete('access_token');
      res.cookies.delete('refresh_token');
      res.cookies.delete('userdata');

      return res;
    }

    const {
      expireIn,
      userdata,
      access_token: access_token_from_database,
      refresh_token: refresh_token_from_database,
    } = sesion;

    const updatedExpiresInString = new Date(expireIn);

    const ENVIRONMENT = process.env.NODE_ENV as TEnvironment;
    const domain = Hostname[ENVIRONMENT];

    if (isHome)
      return NextResponse.redirect(new URL('/panel', req.url), {
        headers: {
          'Set-Cookie': [
            `userdata=${encodeURIComponent(JSON.stringify(userdata))}; Expires=${updatedExpiresInString.toUTCString()}`,
            `access_token=${encodeURIComponent(JSON.stringify(access_token_from_database))}; Expires=${updatedExpiresInString.toUTCString()}`,
            `refresh_token=${encodeURIComponent(JSON.stringify(refresh_token_from_database))}; Expires=${updatedExpiresInString.toUTCString()}; HttpOnly; Secure; SameSite=none; Domain=${domain}`,
          ].join(', '),
        },
      });

    const res = NextResponse.next();

    res.cookies.set('userdata', JSON.stringify(userdata), {
      expires: updatedExpiresInString,
    });
    res.cookies.set(
      'refresh_token',
      JSON.stringify(refresh_token_from_database),
      {
        httpOnly: true,
        secure: true,
        expires: updatedExpiresInString,
        sameSite: 'none',
        domain: domain,
      },
    );
    res.cookies.set(
      'access_token',
      JSON.stringify(access_token_from_database),
      { expires: updatedExpiresInString },
    );

    return res;
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
