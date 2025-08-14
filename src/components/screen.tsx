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

import AppSidebar from '@/components/app-sidebar';
import Link from 'next/link';
import ScreenDialog from './screen-dialog';
import { Separator } from '@/components/ui/separator';
import { User } from '@/types/users.types';
import { usePathname } from 'next/navigation';
import { userStore } from '@/store/user.store';

interface Props {
  userdata: User;
  children: ReactNode;
}

export default function Screen({ children, userdata }: Props) {
  const pathname = usePathname();
  const isPulverizacionDetail = pathname === '/dashboard/spray';
  const isEnterpriseRoute = pathname.includes('enterprise');
  const isSubscriptionRoute = pathname.includes('billing');
  const isExtraRoute = pathname.includes('logs');
  const HEADER_TITLE = (
    isEnterpriseRoute
      ? ENTERPRISE_ROUTES
      : isSubscriptionRoute
        ? SUBSCRIPTION_ROUTES
        : isExtraRoute
          ? EXTRAS_ROUTES
          : ROUTES
  ).find((route) => route.url === pathname);

  const { suscripcion, setUserdata } = userStore();

  useEffect(() => {
    if (userdata) setUserdata(userdata);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { message_info, next_payment_date } = suscripcion || {};

  return (
    <>
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
                      <Link href='/dashboard'>Empresa</Link>
                    ) : isSubscriptionRoute ? (
                      <Link href={'/billing'}>Suscripción</Link>
                    ) : isExtraRoute ? (
                      <Link href={'/logs'}>Extra</Link>
                    ) : (
                      <Link href={'/dashboard'}>Dashboard</Link>
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
                        <Link href='/dashboard'>Pulverizaciones</Link>
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
        {message_info && message_info !== 'disabled' && (
          <ScreenDialog
            message_info={message_info}
            next_payment_date={next_payment_date as string}
          />
        )}
      </SidebarProvider>
    </>
  );
}
