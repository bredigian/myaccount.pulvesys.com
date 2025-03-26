'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  ENTERPRISE_ROUTES,
  EXTRAS_ROUTES,
  ROUTES,
  SUBSCRIPTION_ROUTES,
} from '@/routes';
import { ReactNode, useEffect } from 'react';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { AppSidebar } from '@/components/app-sidebar';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Usuario } from '@/types/usuario.types';
import { usePathname } from 'next/navigation';
import { usuarioStore } from '@/store/usuario.store';

interface Props {
  userdata: Usuario;
  children: ReactNode;
}

export default function Screen({ children, userdata }: Props) {
  const pathname = usePathname();
  const isPulverizacionDetail = pathname === '/panel/pulverizacion';
  const isEnterpriseRoute = pathname.includes('empresa');
  const isSubscriptionRoute = pathname.includes('facturacion');
  const isExtraRoute = pathname.includes('historial');
  const HEADER_TITLE = (
    isEnterpriseRoute
      ? ENTERPRISE_ROUTES
      : isSubscriptionRoute
        ? SUBSCRIPTION_ROUTES
        : isExtraRoute
          ? EXTRAS_ROUTES
          : ROUTES
  ).find((route) => route.url === pathname);

  const { nombre_usuario, setUserdata } = usuarioStore();

  useEffect(() => {
    if (!nombre_usuario) if (userdata) setUserdata(userdata);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='overflow-x-hidden'>
        <header className='flex h-16 shrink-0 items-center gap-2'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  {isEnterpriseRoute ? (
                    <Link href='/panel'>Empresa</Link>
                  ) : isSubscriptionRoute ? (
                    <Link href={'/facturacion'}>Suscripción</Link>
                  ) : isExtraRoute ? (
                    <Link href={'/historial'}>Extra</Link>
                  ) : (
                    <Link href={'/panel'}>Administración</Link>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                {!isPulverizacionDetail ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{HEADER_TITLE?.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <>
                    <BreadcrumbItem className='hidden md:block'>
                      <Link href='/panel'>Pulverizaciones</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className='hidden md:block' />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Detalle</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
