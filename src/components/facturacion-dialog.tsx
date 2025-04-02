'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from './ui/button';
import { Settings2 } from 'lucide-react';
import { usuarioStore } from '@/store/usuario.store';

export const ManageFacturacionDialog = () => {
  const { isSubscriptionActive } = usuarioStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          Administrar
          <Settings2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {isSubscriptionActive
              ? 'Cancelar suscripción'
              : 'Volver a suscribirse'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
