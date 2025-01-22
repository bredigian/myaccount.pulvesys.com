'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ReactNode, useState } from 'react';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { AppSidebar } from '@/components/app-sidebar';
import { ROUTES } from '@/routes';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';

interface Props {
  children: ReactNode;
}

export default function Screen({ children }: Props) {
  const pathname = usePathname();
  const HEADER_TITLE = ROUTES.find((route) => route.url === pathname);

  const [open, setOpen] = useState(false);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href='#'>Administración</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>{HEADER_TITLE?.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
