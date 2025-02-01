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
import Cookies from 'js-cookie';
import { Tratamiento } from '@/types/tratamientos.types';
import { UUID } from 'crypto';
import { deleteTratamiento } from '@/services/tratamientos.service';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useDataStore } from '@/store/data.store';
import { useDialog } from '@/hooks/use-dialog';
import { useRouter } from 'next/navigation';

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
      </DrawerContent>
    </Drawer>
  );
};

export const DeleteTratamientoDialog = ({ id }: { id: UUID }) => {
  const { push } = useRouter();
  const { getTratamientos } = useDataStore();

  const handleDelete = async () => {
    try {
      const access_token = Cookies.get('access_token');
      if (!access_token) {
        toast.error('La sesión ha expirado', { position: 'top-center' });
        push('/');

        return;
      }

      await deleteTratamiento(id, access_token);
      await revalidate('tratamientos');
      await getTratamientos(access_token);

      toast.success('El tipo de tratamiento fue eliminado.');
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message, { className: 'mb-[216px]' });
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
