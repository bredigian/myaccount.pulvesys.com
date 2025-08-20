'use client';

import * as React from 'react';

import { Avatar, AvatarFallback } from './ui/avatar';
import { ChevronsUpDown, Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
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
  SidebarRail,
} from '@/components/ui/sidebar';

import Image from 'next/image';
import Link from 'next/link';
import { LogoutDialog } from './logout-dialog';
import NavSection from '@/components/nav-section';
import { ROLES } from '@/types/users.types';
import original from '../../public/logo_dalle.webp';
import { useTheme } from 'next-themes';
import { userStore } from '@/store/user.store';

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { rol, isEmployer, suscripcion, nombre, apellido, nombre_usuario } =
    userStore();

  const { free_trial, next_payment_date, status } = suscripcion || {};

  const now = Date.now();
  const endSuscripcionDate = new Date(next_payment_date as string).getTime();

  const isFreeTrialExpired = !free_trial && now > endSuscripcionDate;

  const { setTheme } = useTheme();

  const FULLNAME_INITALS =
    (nombre as string)?.charAt(0) + (apellido as string)?.charAt(0) ||
    ''.toUpperCase();

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
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu key={'dropdown-menu'}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarFallback className='rounded-lg'>
                      {FULLNAME_INITALS ?? ''}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>
                      {nombre} {apellido}
                    </span>
                    <span className='truncate text-xs'>
                      @{nombre_usuario ?? ''}
                    </span>
                  </div>
                  <ChevronsUpDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side='top'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    <Avatar className='h-8 w-8 rounded-lg'>
                      <AvatarFallback className='rounded-lg'>
                        {FULLNAME_INITALS ?? ''}
                      </AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-medium'>
                        {nombre ?? ''} {apellido ?? ''}
                      </span>
                      <span className='truncate text-xs'>
                        @{nombre_usuario ?? ''}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <DropdownMenuItem className='cursor-pointer'>
                      <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                      <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                      Tema
                    </DropdownMenuItem>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start'>
                    <DropdownMenuItem onClick={() => setTheme('light')}>
                      Claro
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                      Oscuro
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')}>
                      Sistema
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <LogoutDialog />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
