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
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { ROUTES } from '@/routes';
import logo from '../../public/logo_dalle.webp';

const USER = {
  name: 'Matías Rodríguez',
  email: 'matiasrodriguez@gmail.com',
  avatar: 'MR',
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href={'/'}>
                <Image
                  src={logo}
                  alt='Logo del Sistema de Ordenes de Pulverización'
                  className='size-9 rounded-md'
                />
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='font-semibold'>PulveSys</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={ROUTES} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={USER} />
      </SidebarFooter>
    </Sidebar>
  );
}
