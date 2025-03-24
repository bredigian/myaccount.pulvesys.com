'use client';

import * as React from 'react';

import { ENTERPRISE_ROUTES, ROUTES } from '@/routes';
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
import { NavEnterpise } from './nav-enterprise';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { ROLES } from '@/types/usuario.types';
import logo from '../../public/logo.png';
import { usuarioStore } from '@/store/usuario.store';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { rol } = usuarioStore();

  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href={'/'}>
                <Image
                  src={logo}
                  alt='Logo de PulveSys'
                  className='size-9 rounded-md'
                  id='primary_pulvesys_logo'
                />
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='flex items-center gap-2 font-semibold'>
                    PulveSys
                    <h2 className='w-fit rounded-md bg-primary/60 px-2 py-1 text-xs font-normal text-primary-foreground'>
                      {ROLES[rol as keyof typeof ROLES]}
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
        <NavMain items={ROUTES} />
        {rol === 'EMPRESA' && <NavEnterpise items={ENTERPRISE_ROUTES} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
