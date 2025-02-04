'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ReactNode, useEffect } from 'react';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { AppSidebar } from '@/components/app-sidebar';
import Link from 'next/link';
import { ROUTES } from '@/routes';
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
  const HEADER_TITLE = ROUTES.find((route) => route.url === pathname);

  const { nombre_usuario, setUserdata } = usuarioStore();

  useEffect(() => {
    if (!nombre_usuario) if (userdata) setUserdata(userdata);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <Link href='/panel'>Administración</Link>
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
