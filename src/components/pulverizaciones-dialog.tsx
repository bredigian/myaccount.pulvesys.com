'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
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
import { Droplet, Trash2 } from 'lucide-react';
import { Dialog as TDialog, useDialog } from '@/hooks/use-dialog';

import { AddOrEditCampoDialog } from './campos-dialog';
import { AddOrEditCultivoDialog } from './cultivos-dialog';
import { AddOrEditProductoDialog } from './productos-dialog';
import AddOrEditPulverizacionForm from './pulverizaciones-form';
import { AddOrEditTratamientoDialog } from './tratamientos-dialog';
import { Button } from './ui/button';
import Cookies from 'js-cookie';
import { UUID } from 'crypto';
import { deletePulverizacion } from '@/services/pulverizaciones.service';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';

import { AllData } from '@/types/root.types';

interface Props {
  data: AllData;
}

export const AddOrEditPulverizacionDialog = ({ data }: Props) => {
  const { open, setOpen, handleOpen } = useDialog();
  const addCampoDialog = useDialog();
  const addCultivoDialog = useDialog();
  const addTratamientoDialog = useDialog();
  const addProductoDialog = useDialog();

  const isMobile = useIsMobile();

  return isMobile ? (
    <>
      <Drawer dismissible={false} open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button>
            Crear
            <Droplet />
          </Button>
        </DrawerTrigger>
        <DrawerContent className='h-auto'>
          <DrawerHeader>
            <DrawerTitle>Nueva pulverización</DrawerTitle>
            <DrawerDescription>
              Completa con lo requerido para la pulverización
            </DrawerDescription>
          </DrawerHeader>
          <AddOrEditPulverizacionForm
            handleOpen={handleOpen}
            camposDialog={addCampoDialog}
            cultivosDialog={addCultivoDialog}
            tratamientosDialog={addTratamientoDialog}
            productosDialog={addProductoDialog}
            handleExternalDialog={(dialog: TDialog) => {
              handleOpen();
              setTimeout(() => dialog.handleOpen(), 250);
            }}
            data={data}
          />
        </DrawerContent>
      </Drawer>
      <AddOrEditCampoDialog
        hidden
        customOpen={addCampoDialog.open}
        customSetOpen={() => {
          addCampoDialog.setOpen(!addCampoDialog.open);
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
        customHandleOpen={() => {
          addCampoDialog.handleOpen();
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
      />
      <AddOrEditCultivoDialog
        hidden
        customOpen={addCultivoDialog.open}
        customSetOpen={() => {
          addCultivoDialog.setOpen(!addCultivoDialog.open);
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
        customHandleOpen={() => {
          addCultivoDialog.handleOpen();
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
      />
      <AddOrEditTratamientoDialog
        hidden
        customOpen={addTratamientoDialog.open}
        customSetOpen={() => {
          addTratamientoDialog.setOpen(!addTratamientoDialog.open);
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
        customHandleOpen={() => {
          addTratamientoDialog.handleOpen();
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
      />
      <AddOrEditProductoDialog
        hidden
        customOpen={addProductoDialog.open}
        customSetOpen={() => {
          addProductoDialog.setOpen(!addProductoDialog.open);
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
        customHandleOpen={() => {
          addProductoDialog.handleOpen();
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
      />
    </>
  ) : (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            Crear
            <Droplet />
          </Button>
        </DialogTrigger>
        <DialogContent className='h-auto'>
          <DialogHeader>
            <DialogTitle>Nueva pulverización</DialogTitle>
            <DialogDescription>
              Completa con lo requerido para la pulverización
            </DialogDescription>
          </DialogHeader>
          <AddOrEditPulverizacionForm
            handleOpen={handleOpen}
            camposDialog={addCampoDialog}
            cultivosDialog={addCultivoDialog}
            tratamientosDialog={addTratamientoDialog}
            productosDialog={addProductoDialog}
            handleExternalDialog={(dialog: TDialog) => {
              handleOpen();
              setTimeout(() => dialog.handleOpen(), 250);
            }}
            data={data}
          />
        </DialogContent>
      </Dialog>
      <AddOrEditCampoDialog
        hidden
        customOpen={addCampoDialog.open}
        customSetOpen={() => {
          addCampoDialog.setOpen(!addCampoDialog.open);
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
        customHandleOpen={() => {
          addCampoDialog.handleOpen();
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
      />
      <AddOrEditCultivoDialog
        hidden
        customOpen={addCultivoDialog.open}
        customSetOpen={() => {
          addCultivoDialog.setOpen(!addCultivoDialog.open);
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
        customHandleOpen={() => {
          addCultivoDialog.handleOpen();
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
      />
      <AddOrEditTratamientoDialog
        hidden
        customOpen={addTratamientoDialog.open}
        customSetOpen={() => {
          addTratamientoDialog.setOpen(!addTratamientoDialog.open);
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
        customHandleOpen={() => {
          addTratamientoDialog.handleOpen();
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
      />
      <AddOrEditProductoDialog
        hidden
        customOpen={addProductoDialog.open}
        customSetOpen={() => {
          addProductoDialog.setOpen(!addProductoDialog.open);
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
        customHandleOpen={() => {
          addProductoDialog.handleOpen();
          if (!open) setTimeout(() => handleOpen(), 250);
        }}
      />
    </>
  );
};

export const DeletePulverizacionDialog = ({ id }: { id: UUID }) => {
  const { push } = useRouter();

  const handleDelete = async () => {
    try {
      const access_token = Cookies.get('access_token');
      if (!access_token) {
        toast.error('La sesión ha expirado', { position: 'top-center' });
        push('/');

        return;
      }

      await deletePulverizacion(id, access_token);
      await revalidate('pulverizaciones');

      toast.success('La pulverizacion fue eliminada.');

      push('/');
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message, { className: 'mb-[216px]' });
    }
  };

  const isMobile = useIsMobile();

  return isMobile ? (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={'destructive'} size={'icon'}>
          <Trash2 />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='z-50'>
        <DrawerHeader>
          <DrawerTitle>¿Estás seguro?</DrawerTitle>
          <DrawerDescription>
            Esta acción no se puede deshacer
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant={'destructive'} onClick={handleDelete}>
            Eliminar
          </Button>
          <DrawerClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'destructive'} size={'icon'}>
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent className='z-50'>
        <DialogHeader>
          <DialogTitle>¿Estás seguro?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={'destructive'} onClick={handleDelete}>
            Eliminar
          </Button>
          <DialogClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
