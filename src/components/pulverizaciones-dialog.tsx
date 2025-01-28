'use client';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';

import AddOrEditPulverizacionForm from './pulverizaciones-form';
import { Button } from './ui/button';
import { Droplet } from 'lucide-react';
import { useDialog } from '@/hooks/use-dialog';

export const AddOrEditPulverizacionDialog = () => {
  const { open, setOpen, handleOpen } = useDialog();

  return (
    <Drawer dismissible={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          Crear
          <Droplet />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Nueva pulverización</DrawerTitle>
          <DrawerDescription>
            Completa con lo requerido para la pulverización
          </DrawerDescription>
        </DrawerHeader>
        <AddOrEditPulverizacionForm handleOpen={handleOpen} />
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant={'outline'} onClick={() => setOpen(false)}>
              Cerrar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
