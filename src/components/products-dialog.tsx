'use client';

import {
  CheckIcon,
  PackageOpen,
  PackagePlus,
  PackageXIcon,
} from 'lucide-react';
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
import { Dispatch, SetStateAction, useState } from 'react';
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

import { APIError } from '@/types/error.types';
import { AddOrEditProductForm } from './products-form';
import { Button } from './ui/button';
import Cookies from 'js-cookie';
import { Product } from '@/types/products.types';
import { ReloadIcon } from '@radix-ui/react-icons';
import { UUID } from 'crypto';
import { cn } from '@/lib/utils';
import { deleteProduct } from '@/services/products.service';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/use-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';

export const AddOrEditProductDialog = ({
  isEdit,
  data,
  hidden,
  customOpen,
  customSetOpen,
  customHandleOpen,
}: {
  isEdit?: boolean;
  data?: Product;
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
      key={'add-producto-drawer'}
    >
      {!hidden && (
        <DrawerTrigger asChild>
          <Button size={!isEdit ? 'default' : 'sm'}>
            {!isEdit ? 'Agregar' : 'Modificar'}
            {!isEdit ? <PackagePlus /> : <PackageOpen />}
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {!isEdit ? 'Nuevo producto' : 'Modificar producto'}
          </DrawerTitle>
          <DrawerDescription>
            Completa con las caracteristicas del producto
          </DrawerDescription>
        </DrawerHeader>
        <AddOrEditProductForm
          isEdit={isEdit}
          data={data}
          handleOpen={customHandleOpen ?? handleOpen}
        />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog
      open={customOpen ?? open}
      onOpenChange={customSetOpen ?? setOpen}
      key={'add-producto-dialog'}
    >
      {!hidden && (
        <DialogTrigger asChild>
          <Button size={!isEdit ? 'default' : 'sm'}>
            {!isEdit ? 'Agregar' : 'Modificar'}
            {!isEdit ? <PackagePlus /> : <PackageOpen />}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {!isEdit ? 'Nuevo producto' : 'Modificar producto'}
          </DialogTitle>
          <DialogDescription>
            Completa con las caracteristicas del producto
          </DialogDescription>
        </DialogHeader>
        <AddOrEditProductForm
          isEdit={isEdit}
          data={data}
          handleOpen={customHandleOpen ?? handleOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

type State = 'pending' | 'processing' | 'success' | 'error';

export const DeleteProductDialog = ({ id }: { id: UUID }) => {
  const { push } = useRouter();
  const [state, setState] = useState<State>('pending');

  const { open, setOpen, handleOpen } = useDialog();

  const handleDelete = async () => {
    try {
      setState('processing');
      const access_token = Cookies.get('access_token');
      if (!access_token) {
        toast.error('La sesión ha expirado', { position: 'top-center' });
        push('/');

        return;
      }

      await deleteProduct(id, access_token);

      setState('success');

      setTimeout(async () => {
        handleOpen();
        await revalidate('productos');
      }, 1000);
    } catch (error) {
      setState('error');
      const { statusCode, message } = error as APIError;

      toast.error(message, { position: 'top-center' });
      const unauthorized = statusCode === 401 || statusCode === 403;
      if (unauthorized) setTimeout(() => push('/'), 250);
    }
  };

  const isMobile = useIsMobile();

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size={'sm'} variant={'destructive'}>
          Eliminar
          <PackageXIcon />
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
          <Button
            variant={'destructive'}
            onClick={handleDelete}
            disabled={state === 'success' || state === 'processing'}
            className={cn(
              state === 'success' &&
                '!bg-green-700 text-primary-foreground disabled:opacity-100 dark:text-primary',
            )}
          >
            {state === 'pending' || state === 'error' ? (
              <>Eliminar</>
            ) : state === 'processing' ? (
              <>
                Procesando <ReloadIcon className='animate-spin' />
              </>
            ) : (
              state === 'success' && (
                <>
                  Eliminado <CheckIcon />
                </>
              )
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={'sm'} variant={'destructive'}>
          Eliminar
          <PackageXIcon />
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
          <Button
            variant={'destructive'}
            onClick={handleDelete}
            disabled={state === 'success' || state === 'processing'}
            className={cn(
              state === 'success' &&
                '!bg-green-700 text-primary-foreground disabled:opacity-100 dark:text-primary',
            )}
          >
            {state === 'pending' || state === 'error' ? (
              <>Eliminar</>
            ) : state === 'processing' ? (
              <>
                Procesando <ReloadIcon className='animate-spin' />
              </>
            ) : (
              state === 'success' && (
                <>
                  Eliminado <CheckIcon />
                </>
              )
            )}
          </Button>
          <DialogClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
