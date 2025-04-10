import { NextRequest, NextResponse } from 'next/server';

import { verifySesion } from './services/auth.service';

export async function middleware(req: NextRequest) {
  const access_token_from_request = req.cookies.get('access_token');
  const refresh_token_from_request = req.cookies.get('refresh_token');

  const { pathname } = req.nextUrl;

  if (access_token_from_request && refresh_token_from_request) {
    // Hay token de acceso en las cookies y verifica la sesión

    const sesion = await verifySesion(
      access_token_from_request.value,
      refresh_token_from_request,
    );

    if ('error' in sesion) {
      // Se produce un error en la verificación de la sesión y hace las redirecciones en base al 'pathname'

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

    // La verificación de la sesión se hizo exitosamente y continua con la ejecución del middleware

    const { access_token, refresh_token, expireIn, userdata, domain } = sesion;

    const { isEmployer, suscripcion } = userdata;

    if (pathname.includes('/suscripcion-expirada') && !isEmployer)
      // Está en la ruta 'suscripcion-expirada' y NO es un empleado, entonces redirige hacia /facturación
      return NextResponse.redirect(new URL('/facturacion', req.url));

    const { free_trial, next_payment_date, status } = suscripcion;

    const now = Date.now();
    const endDate = new Date(next_payment_date as string).getTime();

    const isFreeTrialExpired = !free_trial && now > endDate;

    if (
      !pathname.includes('/facturacion') &&
      pathname !== '/suscripcion-expirada'
    )
      if (
        status !== 'authorized' &&
        (isFreeTrialExpired || status === 'paused')
      )
        // La ruta es DISTINTA a /facturación y a /suscripcion-expirada
        // status es DISTINTO a 'authorized' y el free trial expiró o el status es igual a 'paused', entonces redirijo si NO es empleado a /facturación y si no a /suscripción-expirada
        return NextResponse.redirect(
          new URL(
            !isEmployer ? '/facturacion' : '/suscripcion-expirada',
            req.url,
          ),
        );

    if (pathname.includes('/facturacion') || pathname.includes('/empresa'))
      if (isEmployer)
        // La ruta es /facturación o /empresa
        // El usuario es EMPLEADO
        return NextResponse.redirect(new URL('/', req.url));

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
      pathname.includes('/historial') ||
      pathname.includes('/suscripcion-expirada')
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
    pathname.includes('/historial') ||
    pathname.includes('/suscripcion-expirada')
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
