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
import { Dispatch, SetStateAction } from 'react';
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
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';

export const AddOrEditCultivoDialog = ({
  isEdit,
  data,
  from,
  hidden,
  customOpen,
  customSetOpen,
  customHandleOpen,
}: {
  isEdit?: boolean;
  data?: Cultivo;
  from?: 'cultivos' | 'pulverizaciones';
  hidden?: boolean;
  customOpen?: boolean;
  customSetOpen?: Dispatch<SetStateAction<boolean>>;
  customHandleOpen?: () => void;
}) => {
  const { open, setOpen, handleOpen } = useDialog();

  const isMobile = useIsMobile();

  return isMobile ? (
    <Drawer open={customOpen ?? open} onOpenChange={customSetOpen ?? setOpen}>
      {!hidden && (
        <DrawerTrigger asChild>
          {!isEdit ? (
            <Button
              size={from === 'cultivos' ? 'default' : 'sm'}
              variant={from === 'pulverizaciones' ? 'outline' : 'default'}
              className='mb-2 flex w-full items-center justify-between'
            >
              Agregar
              <PlusSquare />
            </Button>
          ) : (
            <Button size={'icon'} variant={'outline'}>
              <Edit />
            </Button>
          )}
        </DrawerTrigger>
      )}
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
              size={from === 'cultivos' ? 'default' : 'sm'}
              variant={from === 'pulverizaciones' ? 'outline' : 'default'}
              className='mb-2 flex w-full items-center justify-between'
            >
              Agregar
              <PlusSquare />
            </Button>
          ) : (
            <Button size={'icon'} variant={'outline'}>
              <Edit />
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {!isEdit ? 'Nuevo cultivo' : 'Modificar cultivo'}
          </DialogTitle>
          <DialogDescription>
            Completa con las caracteristicas del cultivo
          </DialogDescription>
        </DialogHeader>
        <AddOrEditCultivoForm
          isEdit={isEdit}
          data={data}
          handleOpen={customHandleOpen ?? handleOpen}
        />
      </DialogContent>
    </Dialog>
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
        toast.error(error.message, { className: 'mb-[216px] md:mb-0' });
    }
  };

  const isMobile = useIsMobile();

  return isMobile ? (
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
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'icon'} variant={'destructive'}>
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás seguro?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className=''>
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
