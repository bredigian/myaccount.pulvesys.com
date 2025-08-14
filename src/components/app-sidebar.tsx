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
import NavSection from '@/components/nav-section';
import NavSettings from './nav-settings';
import NavUser from '@/components/nav-user';
import { ROLES } from '@/types/users.types';
import original from '../../public/logo_dalle.webp';
import { userStore } from '@/store/user.store';

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { rol, isEmployer, suscripcion } = userStore();

  const { free_trial, next_payment_date, status } = suscripcion || {};

  const now = Date.now();
  const endSuscripcionDate = new Date(next_payment_date as string).getTime();

  const isFreeTrialExpired = !free_trial && now > endSuscripcionDate;

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
          <NavSection
            title='Empresa'
            items={ENTERPRISE_ROUTES}
            isDisabled={
              status !== 'authorized' &&
              (isFreeTrialExpired || status === 'paused')
            }
          />
        )}
        <NavSection
          title='Dashboard'
          items={ROUTES}
          isDisabled={
            status !== 'authorized' &&
            (isFreeTrialExpired || status === 'paused')
          }
        />
        {!isEmployer && (
          <NavSection title='Suscripción' items={SUBSCRIPTION_ROUTES} />
        )}
        <NavSection
          title='Extra'
          items={EXTRAS_ROUTES}
          isDisabled={
            status !== 'authorized' &&
            (isFreeTrialExpired || status === 'paused')
          }
        />
      </SidebarContent>
      <SidebarFooter>
        <NavSettings />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
