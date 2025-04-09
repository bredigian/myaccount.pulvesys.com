import { NextRequest, NextResponse } from 'next/server';

import { verifySesion } from './services/auth.service';

export async function middleware(req: NextRequest) {
  const access_token_from_request = req.cookies.get('access_token');
  const refresh_token_from_request = req.cookies.get('refresh_token');

  const { pathname } = req.nextUrl;

  if (access_token_from_request && refresh_token_from_request) {
    const sesion = await verifySesion(
      access_token_from_request.value,
      refresh_token_from_request,
    );

    if ('error' in sesion) {
      if (
        pathname.includes('/panel') ||
        pathname.includes('/empresa') ||
        pathname.includes('/facturacion') ||
        pathname.includes('/historial')
      ) {
        return NextResponse.redirect(new URL('/', req.url), {
          headers: {
            'Set-Cookie': [
              `access_token=;`,
              `refresh_token=;`,
              `userdata=;`,
            ].join(', '),
          },
        });
      }
      const res = NextResponse.next();
      res.cookies.delete('access_token');
      res.cookies.delete('refresh_token');
      res.cookies.delete('userdata');

      return res;
    }

    const { access_token, refresh_token, expireIn, userdata, domain } = sesion;

    const { isEmployer, suscripcion } = userdata;

    if (pathname.includes('/suscripcion-expirada') && !isEmployer)
      return NextResponse.redirect(new URL('/facturacion', req.url));

    const { free_trial, next_payment_date, status } = suscripcion;

    const now = Date.now();
    const endDate = new Date(next_payment_date as string).getTime();

    const isFreeTrialExpired = !free_trial && now > endDate;

    if (!pathname.includes('/facturacion'))
      if (
        status !== 'authorized' &&
        (isFreeTrialExpired || status === 'paused')
      )
        return NextResponse.redirect(
          new URL(
            !isEmployer ? '/facturacion' : '/suscripcion-expirada',
            req.url,
          ),
        );

    if (pathname.includes('/facturacion') || pathname.includes('/empresa')) {
      if (isEmployer) return NextResponse.redirect(new URL('/', req.url));
    }

    if (pathname.includes('/empresa')) {
      const { rol, empresa_id } = userdata;

      if (rol !== 'EMPRESA' && !empresa_id)
        return NextResponse.redirect(new URL('/', req.url));
    }

    const expireDate = new Date(expireIn);

    if (
      pathname.includes('/panel') ||
      pathname.includes('/empresa') ||
      pathname.includes('/facturacion') ||
      pathname.includes('/historial')
    ) {
      const res = NextResponse.next();
      res.cookies.set('access_token', access_token, {
        expires: expireDate,
        domain,
      });
      res.cookies.set('refresh_token', refresh_token as string, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: expireDate,
        domain,
      });
      res.cookies.set('userdata', JSON.stringify(userdata), {
        expires: expireDate,
        domain,
      });

      return res;
    }

    return NextResponse.redirect(new URL('/panel', req.url), {
      headers: {
        'Set-Cookie': [
          `access_token=${access_token}; Expires=${expireDate}; Domain=${domain};`,
          `refresh_token=${refresh_token}; Expires=${expireDate}; HttpOnly; Secure; Domain=${domain}; SameSite=None;`,
          `userdata=${JSON.stringify(userdata)}; Expires=${expireDate}; Domain=${domain};`,
        ].join(', '),
      },
    });
  }

  if (
    pathname.includes('/panel') ||
    pathname.includes('/empresa') ||
    pathname.includes('/facturacion') ||
    pathname.includes('/historial')
  )
    return NextResponse.redirect(new URL('/', req.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/panel',
    '/panel/pulverizacion',
    '/panel/pulverizacion/:id',
    '/panel/productos',
    '/panel/campos',
    '/panel/cultivos&tratamientos',
    '/empresa',
    '/empresa/usuarios',
    '/facturacion',
    '/historial',
    '/suscripcion-expirada',
  ],
};
