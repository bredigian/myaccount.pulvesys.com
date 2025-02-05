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
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';

export const AddOrEditCampoDialog = ({
  isEdit,
  data,
  variant,
  className,
  onlyIcon,
  hidden,
  customOpen,
  customSetOpen,
  customHandleOpen,
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
  hidden?: boolean;
  customOpen?: boolean;
  customSetOpen?: Dispatch<SetStateAction<boolean>>;
  customHandleOpen?: () => void;
}) => {
  const { open, setOpen, handleOpen } = useDialog();

  const isMobile = useIsMobile();

  return isMobile ? (
    <Drawer
      open={customOpen ?? open}
      onOpenChange={customSetOpen ?? setOpen}
      dismissible={false}
    >
      {!hidden && (
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
      )}
      <DrawerContent className='z-[9999] h-auto'>
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
          handleOpen={customHandleOpen ?? handleOpen}
        />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={customOpen ?? open} onOpenChange={customSetOpen ?? setOpen}>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent className='z-[9999] h-auto'>
        <DialogHeader>
          <DialogTitle>
            {!isEdit ? 'Nueva ubicación' : 'Modificar ubicación'}
          </DialogTitle>
          <DialogDescription>
            Completa con las caracteristicas del campo
          </DialogDescription>
        </DialogHeader>
        <AddOrEditCampoForm
          isEdit={isEdit}
          data={data}
          handleOpen={customHandleOpen ?? handleOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export const DeleteCampoDialog = ({ id }: { id: UUID }) => {
  const { push } = useRouter();
  const { getCampos } = useDataStore();

  const isMobile = useIsMobile();

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
        toast.error(error.message, { className: 'mb-[216px] md:mb-0' });
    }
  };

  return isMobile ? (
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
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'icon'} variant={'destructive'}>
          <MapPinX />
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
