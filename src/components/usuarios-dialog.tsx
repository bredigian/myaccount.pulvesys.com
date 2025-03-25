'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Dispatch, SetStateAction } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { UserPen, UserPlus } from 'lucide-react';

import AddOrEditUsuarioForm from './usuarios-form';
import { Button } from './ui/button';
import { Usuario } from '@/types/usuario.types';
import { useDialog } from '@/hooks/use-dialog';
import { useIsMobile } from '@/hooks/use-mobile';

export const AddOrEditUsuarioDialog = ({
  isEdit,
  data,
  variant,
  className,
  onlyIcon,
  hidden,
  customOpen,
  customSetOpen,
  customHandleOpen,
}: {
  isEdit?: boolean;
  data?: Usuario;
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost';
  className?: string;
  onlyIcon?: boolean;
  hidden?: boolean;
  customOpen?: boolean;
  customSetOpen?: Dispatch<SetStateAction<boolean>>;
  customHandleOpen?: () => void;
}) => {
  const { open, setOpen, handleOpen } = useDialog();

  const isMobile = useIsMobile();

  return isMobile ? (
    <Drawer
      open={customOpen ?? open}
      onOpenChange={customSetOpen ?? setOpen}
      dismissible={false}
    >
      {!hidden && (
        <DrawerTrigger asChild>
          {!isEdit ? (
            <Button
              variant={variant ?? 'default'}
              className={className}
              size={!onlyIcon ? 'default' : 'icon'}
            >
              {!onlyIcon && 'Agregar'}
              <UserPlus />
            </Button>
          ) : (
            <Button size={'icon'} variant={'outline'}>
              <UserPen />
            </Button>
          )}
        </DrawerTrigger>
      )}
      <DrawerContent className='h-auto'>
        <DrawerHeader>
          <DrawerTitle>
            {!isEdit ? 'Nuevo usuario' : 'Modificar usuario'}
          </DrawerTitle>
          <DrawerDescription>
            Completá con los datos del usuario
          </DrawerDescription>
        </DrawerHeader>
        <AddOrEditUsuarioForm
          isEdit={isEdit}
          data={data}
          handleOpen={customHandleOpen ?? handleOpen}
        />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={customOpen ?? open} onOpenChange={customSetOpen ?? setOpen}>
      {!hidden && (
        <DialogTrigger asChild>
          {!isEdit ? (
            <Button
              variant={variant ?? 'default'}
              className={className}
              size={!onlyIcon ? 'default' : 'icon'}
            >
              {!onlyIcon && 'Agregar'}
              <UserPlus />
            </Button>
          ) : (
            <Button size={'icon'} variant={'outline'}>
              <UserPen />
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className='h-auto !w-[800px]'>
        <DialogHeader>
          <DialogTitle>
            {!isEdit ? 'Nuevo usuario' : 'Modificar usuario'}
          </DialogTitle>
          <DialogDescription>
            Completá con los datos del usuario
          </DialogDescription>
        </DialogHeader>
        <AddOrEditUsuarioForm
          isEdit={isEdit}
          data={data}
          handleOpen={customHandleOpen ?? handleOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
