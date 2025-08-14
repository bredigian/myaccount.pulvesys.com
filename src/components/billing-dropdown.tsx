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
import { ManageBillingDialog } from './billing-dialog';
import { Settings2 } from 'lucide-react';
import { userStore } from '@/store/user.store';

export const ManageBillingDropdown = () => {
  const { rol } = userStore();
  if (rol === 'ADMIN') return null;

  return (
    <aside className='flex items-start justify-between gap-4'>
      <h2>Visualizá y administrá tu suscripción a PulveSys.</h2>
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
            <DropdownMenuItem asChild>
              <ManageBillingDialog />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  );
};
