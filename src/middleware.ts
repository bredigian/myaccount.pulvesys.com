import { NextRequest, NextResponse } from 'next/server';

import { verifySession } from './services/auth.service';

export async function middleware(req: NextRequest) {
  const access_token_from_request = req.cookies.get('access_token');
  const refresh_token_from_request = req.cookies.get('refresh_token');

  const { pathname } = req.nextUrl;

  if (access_token_from_request && refresh_token_from_request) {
    // Hay token de acceso en las cookies y verifica la sesión

    const session = await verifySession(
      access_token_from_request.value,
      refresh_token_from_request,
    );

    if ('error' in session) {
      // Se produce un error en la verificación de la sesión y hace las redirecciones en base al 'pathname'
      const { extras } = session;

      if (
        pathname.includes('/dashboard') ||
        pathname.includes('/enterprise') ||
        pathname.includes('/billing') ||
        pathname.includes('/logs')
      ) {
        return NextResponse.redirect(new URL('/', req.url), {
          headers: {
            'Set-Cookie': [
              `access_token=; Domain=${extras.domain};`,
              `refresh_token=; Secure; HttpOnly; Domain=${extras.domain}; SameSite=None;`,
              `userdata=; Domain=${extras.domain}`,
            ].join(', '),
          },
        });
      }
      const res = NextResponse.next();
      res.cookies.delete({ name: 'access_token', domain: extras.domain });
      res.cookies.delete({
        name: 'refresh_token',
        domain: extras.domain,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      res.cookies.delete({ name: 'userdata', domain: extras.domain });

      return res;
    }

    // La verificación de la sesión se hizo exitosamente y continua con la ejecución del middleware

    const { access_token, refresh_token, expireIn, userdata, domain } = session;

    const { isEmployer, suscripcion } = userdata;

    if (pathname.includes('/subscription-expired') && !isEmployer)
      // Está en la ruta 'suscription-expired' y NO es un empleado, entonces redirige hacia /billing
      return NextResponse.redirect(new URL('/billing', req.url));

    const { free_trial, next_payment_date, status } = suscripcion;

    const now = Date.now();
    const endDate = new Date(next_payment_date as string).getTime();

    const isFreeTrialExpired = !free_trial && now > endDate;

    if (!pathname.includes('/billing') && pathname !== '/subscription-expired')
      if (
        status !== 'authorized' &&
        (isFreeTrialExpired || status === 'paused')
      )
        // La ruta es DISTINTA a /billing y a /suscription-expired
        // status es DISTINTO a 'authorized' y el free trial expiró o el status es igual a 'paused', entonces redirijo si NO es empleado a /billing y si no a /suscription-expired
        return NextResponse.redirect(
          new URL(!isEmployer ? '/billing' : '/subscription-expired', req.url),
        );

    if (pathname.includes('/billing') || pathname.includes('/enterprise'))
      if (isEmployer)
        // La ruta es /billing o /enterprise
        // El usuario es EMPLEADO
        return NextResponse.redirect(new URL('/', req.url));

    if (pathname.includes('/enterpise')) {
      const { rol, empresa_id } = userdata;

      if (rol !== 'EMPRESA' && !empresa_id)
        return NextResponse.redirect(new URL('/', req.url));
    }

    const expireDate = new Date(expireIn);

    if (
      pathname.includes('/dashboard') ||
      pathname.includes('/enterprise') ||
      pathname.includes('/billing') ||
      pathname.includes('/logs') ||
      pathname.includes('/subscription-expired')
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

    return NextResponse.redirect(new URL('/dashboard', req.url), {
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
    pathname.includes('/dashboard') ||
    pathname.includes('/enterpise') ||
    pathname.includes('/billing') ||
    pathname.includes('/logs') ||
    pathname.includes('/subscription-expired')
  )
    return NextResponse.redirect(new URL('/', req.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/dashboard/spray',
    '/dashboard/pulverizacion/:id',
    '/dashboard/products',
    '/dashboard/locations',
    '/dashboard/crops&treatments',
    '/enterprise',
    '/enterprise/users',
    '/billing',
    '/logs',
    '/subscription-expired',
  ],
};
