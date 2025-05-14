'use client';

import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import Image from 'next/image';
import Link from 'next/link';
import { NavSection } from '@/components/nav-section';
import { NavSettings } from './nav-settings';
import { NavUser } from '@/components/nav-user';
import { OFFLINE_ROUTES } from '@/routes';
import original from '../../public/logo_dalle.webp';

export function OfflineAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href={'/'}>
                <Image
                  src={original}
                  alt='Logo de PulveSys'
                  className='size-9 rounded-md'
                  id='pulvesys_logo'
                />
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='flex items-center gap-2 font-semibold'>
                    PulveSys
                    <h2 className='w-fit rounded-md bg-primary/60 px-1.5 py-0.5 text-xs font-normal text-primary-foreground'>
                      Sin conexión
                    </h2>
                  </span>
                  <p className='truncate text-xs'>Órdenes de pulverización</p>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavSection title='Inicio' items={OFFLINE_ROUTES} />
      </SidebarContent>
      <SidebarFooter>
        <NavSettings />
        <NavUser mode={'offline'} />
      </SidebarFooter>
    </Sidebar>
  );
}
