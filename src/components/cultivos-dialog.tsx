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
import Cookies from 'js-cookie';
import { Cultivo } from '@/types/cultivos.types';
import { UUID } from 'crypto';
import { deleteCultivo } from '@/services/cultivos.service';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useDataStore } from '@/store/data.store';
import { useDialog } from '@/hooks/use-dialog';
import { useRouter } from 'next/navigation';

export const AddOrEditCultivoDialog = ({
  isEdit,
  data,
}: {
  isEdit?: boolean;
  data?: Cultivo;
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
            {!isEdit ? 'Nuevo cultivo' : 'Modificar cultivo'}
          </DrawerTitle>
          <DrawerDescription>
            Completa con las caracteristicas del cultivo
          </DrawerDescription>
        </DrawerHeader>
        <AddOrEditCultivoForm
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

export const DeleteCultivoDialog = ({ id }: { id: UUID }) => {
  const { push } = useRouter();
  const { getCultivos } = useDataStore();

  const handleDelete = async () => {
    try {
      const access_token = Cookies.get('access_token');
      if (!access_token) {
        toast.error('La sesión ha expirado', { position: 'top-center' });
        push('/');

        return;
      }
      await deleteCultivo(id, access_token);
      await revalidate('cultivos');
      await getCultivos(access_token);

      toast.success('El cultivo fue eliminado.');
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
