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
import { Edit, PlusSquare, Trash2 } from 'lucide-react';

import AddOrEditTratamientoForm from './tratamientos-form';
import { Button } from './ui/button';
import { Tratamiento } from '@/types/tratamientos.types';
import { UUID } from 'crypto';
import { deleteTratamiento } from '@/services/tratamientos.service';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/use-dialog';

export const AddOrEditTratamientoDialog = ({
  isEdit,
  data,
}: {
  isEdit?: boolean;
  data?: Tratamiento;
}) => {
  const { open, setOpen, handleOpen } = useDialog();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {!isEdit ? (
          <Button>
            Agregar
            <PlusSquare />
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
            {!isEdit
              ? 'Nuevo tipo de tratamiento'
              : 'Modificar tipo de tratamiento'}
          </DrawerTitle>
          <DrawerDescription>
            Completa con las caracteristicas del tratamiento
          </DrawerDescription>
        </DrawerHeader>
        <AddOrEditTratamientoForm
          isEdit={isEdit}
          data={data}
          handleOpen={handleOpen}
        />
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export const DeleteTratamientoDialog = ({ id }: { id: UUID }) => {
  const handleDelete = async () => {
    try {
      await deleteTratamiento(id);
      await revalidate('tratamientos');

      toast.success('El tipo de tratamiento fue eliminado.');
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
