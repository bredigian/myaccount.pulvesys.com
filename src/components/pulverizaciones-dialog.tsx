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
import { Droplet, Edit, Trash2 } from 'lucide-react';

import AddOrEditPulverizacionForm from './pulverizaciones-form';
import { Button } from './ui/button';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import { UUID } from 'crypto';
import { deleteCultivo } from '@/services/cultivos.service';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';

export const AddOrEditPulverizacionDialog = ({
  isEdit,
  data,
}: {
  isEdit?: boolean;
  data?: Pulverizacion;
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {!isEdit ? (
          <Button>
            Crear
            <Droplet />
          </Button>
        ) : (
          <Button size={'icon'} variant={'outline'}>
            <Edit />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {!isEdit ? 'Nueva pulverización' : 'Modificar pulverización'}
          </DrawerTitle>
          <DrawerDescription>
            Completa con lo requerido para la pulverización
          </DrawerDescription>
        </DrawerHeader>
        <AddOrEditPulverizacionForm />
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export const DeleteCultivoDialog = ({ id }: { id: UUID }) => {
  const handleDelete = async () => {
    try {
      await deleteCultivo(id);
      await revalidate('cultivos');

      toast.success('El cultivo fue eliminado.');
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size={'icon'} variant={'destructive'}>
          <Trash2 />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás seguro?</DrawerTitle>
          <DrawerDescription>
            Esta acción no se puede deshacer
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className=''>
          <Button variant={'destructive'} onClick={handleDelete}>
            Eliminar
          </Button>
          <DrawerClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
