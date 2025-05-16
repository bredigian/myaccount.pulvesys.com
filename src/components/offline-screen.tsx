'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { ReactNode, useEffect } from 'react';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import Link from 'next/link';
import { OfflineAppSidebar } from './offline-app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SessionStore } from '@/db/store';
import { usuarioStore } from '@/store/usuario.store';

// import { usePathname } from 'next/navigation';

interface Props {
  children: ReactNode;
}

export default function ScreenOffline({ children }: Props) {
  // const pathname = usePathname();
  const { setUserdata } = usuarioStore();

  useEffect(() => {
    const fetchLocalUserdata = async () => {
      const { userdata: dbUserdata } = (await SessionStore.get()) || {};
      if (dbUserdata) setUserdata(dbUserdata);
    };

    fetchLocalUserdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SidebarProvider>
        <OfflineAppSidebar />
        <SidebarInset className='overflow-x-hidden'>
          <div className='w-full bg-yellow-300 py-1 text-center text-sm dark:text-primary-foreground'>
            Sin conexión
          </div>
          <header className='flex h-16 shrink-0 items-center gap-2'>
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
              <Separator orientation='vertical' className='mr-2 h-4' />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className='hidden md:block'>
                    <Link href='/offline'>Inicio</Link>
                  </BreadcrumbItem>
                  {/* <BreadcrumbSeparator className='hidden md:block' /> */}
                  {/* {!isPulverizacionDetail ? (
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
                  )} */}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
