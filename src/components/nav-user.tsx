'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';

import LogoutDialog from './logout-dialog';
import { usuarioStore } from '@/store/usuario.store';

export function NavUser() {
  const { nombre_usuario, nombre, apellido } = usuarioStore();
  const avatar = nombre
    ?.charAt(0)
    .concat(apellido?.charAt(0) as string)
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem className='flex items-center justify-between p-2'>
        <div className='flex items-center gap-2'>
          <Avatar className='h-8 w-8 rounded-lg'>
            <AvatarFallback>{avatar}</AvatarFallback>
          </Avatar>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>
              {nombre} {apellido}
            </span>
            <span className='truncate text-xs'>@{nombre_usuario}</span>
          </div>
        </div>
        <LogoutDialog />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
