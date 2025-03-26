'use client';

import * as React from 'react';

import {
  ENTERPRISE_ROUTES,
  EXTRAS_ROUTES,
  ROUTES,
  SUBSCRIPTION_ROUTES,
} from '@/routes';
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
import { ROLES } from '@/types/usuario.types';
import logo from '../../public/logo.png';
import { usuarioStore } from '@/store/usuario.store';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { rol, isEmployer } = usuarioStore();
  console.log(isEmployer);

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
                    <h2 className='w-fit rounded-md bg-primary/60 px-1.5 py-0.5 text-xs font-normal text-primary-foreground'>
                      {isEmployer
                        ? 'Empleado'
                        : ROLES[rol as keyof typeof ROLES]}
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
        {rol === 'EMPRESA' && (
          <NavSection title='Inicio' items={ENTERPRISE_ROUTES} />
        )}
        <NavSection title='Administración' items={ROUTES} />
        {!isEmployer && (
          <NavSection title='Suscripción' items={SUBSCRIPTION_ROUTES} />
        )}
        <NavSection title='Extra' items={EXTRAS_ROUTES} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
