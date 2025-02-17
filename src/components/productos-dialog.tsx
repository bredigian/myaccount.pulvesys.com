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
import { PackageOpen, PackagePlus, PackageXIcon } from 'lucide-react';

import AddOrEditProductoForm from './productos-form';
import { Button } from './ui/button';
import Cookies from 'js-cookie';
import { Producto } from '@/types/productos.types';
import { UUID } from 'crypto';
import { deleteProducto } from '@/services/productos.service';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/use-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';

export const AddOrEditProductoDialog = ({
  isEdit,
  data,
  hidden,
  customOpen,
  customSetOpen,
  customHandleOpen,
}: {
  isEdit?: boolean;
  data?: Producto;
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
        <AddOrEditProductoForm
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
        <AddOrEditProductoForm
          isEdit={isEdit}
          data={data}
          handleOpen={customHandleOpen ?? handleOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export const DeleteProductoDialog = ({ id }: { id: UUID }) => {
  const { push } = useRouter();

  const handleDelete = async () => {
    try {
      const access_token = Cookies.get('access_token');
      if (!access_token) {
        toast.error('La sesión ha expirado', { position: 'top-center' });
        push('/');

        return;
      }

      await deleteProducto(id, access_token);
      await revalidate('productos');

      toast.success('El producto fue eliminado.');
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message, { className: 'mb-[216px] md:mb-0' });
    }
  };

  const isMobile = useIsMobile();

  return isMobile ? (
    <Drawer>
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
