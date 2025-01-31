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
import { Edit, MapPinPlus, MapPinX } from 'lucide-react';

import AddOrEditCampoForm from './campos-form';
import { Button } from './ui/button';
import { Campo } from '@/types/campos.types';
import Cookies from 'js-cookie';
import { UUID } from 'crypto';
import { deleteCampo } from '@/services/campos.service';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useDataStore } from '@/store/data.store';
import { useDialog } from '@/hooks/use-dialog';
import { useRouter } from 'next/navigation';

export const AddOrEditCampoDialog = ({
  isEdit,
  data,
  variant,
  className,
  onlyIcon,
}: {
  isEdit?: boolean;
  data?: Campo;
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost';
  className?: string;
  onlyIcon?: boolean;
}) => {
  const { open, setOpen, handleOpen } = useDialog();

  return (
    <Drawer open={open} onOpenChange={setOpen} dismissible={false}>
      <DrawerTrigger asChild>
        {!isEdit ? (
          <Button
            variant={variant ?? 'default'}
            className={className}
            size={!onlyIcon ? 'default' : 'icon'}
          >
            {!onlyIcon && 'Agregar'}
            <MapPinPlus />
          </Button>
        ) : (
          <Button size={'icon'} variant={'outline'}>
            <Edit />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className='z-[9999]'>
        <DrawerHeader>
          <DrawerTitle>
            {!isEdit ? 'Nueva ubicación' : 'Modificar ubicación'}
          </DrawerTitle>
          <DrawerDescription>
            Completa con las caracteristicas del campo
          </DrawerDescription>
        </DrawerHeader>
        <AddOrEditCampoForm
          isEdit={isEdit}
          data={data}
          handleOpen={handleOpen}
        />
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

export const DeleteCampoDialog = ({ id }: { id: UUID }) => {
  const { push } = useRouter();
  const { getCampos } = useDataStore();

  const handleDelete = async () => {
    try {
      const access_token = Cookies.get('access_token');
      if (!access_token) {
        toast.error('La sesión ha expirado', { position: 'top-center' });
        push('/');

        return;
      }

      await deleteCampo(id, access_token);
      await revalidate('campos');
      await getCampos(access_token);

      toast.success('El campo fue eliminado.');
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message, { className: 'mb-[216px]' });
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size={'icon'} variant={'destructive'}>
          <MapPinX />
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
