'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';

import { Button } from './ui/button';
import { RecoverForm } from './recover-form';
import { useDialog } from '@/hooks/use-dialog';
import { useIsMobile } from '@/hooks/use-mobile';

export const RecoverPasswordDialog = () => {
  const isMobile = useIsMobile();
  const { open, setOpen, handleOpen } = useDialog();

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={'ghost'} className='w-full'>
          Olvidé la contraseña
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Olvidaste la contraseña?</DrawerTitle>
          <DrawerDescription>
            Completa el siguiente formulario y te enviaremos un correo de
            recuperación
          </DrawerDescription>
        </DrawerHeader>
        <RecoverForm handleDialog={handleOpen} />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className='w-full'>
          Olvidé la contraseña
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Olvidaste la contraseña?</DialogTitle>
          <DialogDescription>
            Completa el siguiente formulario y te enviaremos un correo de
            recuperación
          </DialogDescription>
        </DialogHeader>
        <RecoverForm handleDialog={handleOpen} />
      </DialogContent>
    </Dialog>
  );
};
