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

import AddOrEditCultivoForm from './cultivos-form';
import { Button } from './ui/button';
import { Cultivo } from '@/types/cultivos.types';
import { UUID } from 'crypto';
import { deleteCultivo } from '@/services/cultivos.service';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';

export const AddOrEditCultivoDialog = ({
  isEdit,
  data,
}: {
  isEdit?: boolean;
  data?: Cultivo;
}) => {
  return (
    <Drawer>
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
            {!isEdit ? 'Nuevo cultivo' : 'Modificar cultivo'}
          </DrawerTitle>
          <DrawerDescription>
            Completa con las caracteristicas del cultivo
          </DrawerDescription>
        </DrawerHeader>
        <AddOrEditCultivoForm isEdit={isEdit} data={data} />
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
