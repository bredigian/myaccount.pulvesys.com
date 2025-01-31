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
import { PackageOpen, PackagePlus, PackageXIcon } from 'lucide-react';

import AddOrEditProductoForm from './productos-form';
import { Button } from './ui/button';
import Cookies from 'js-cookie';
import { Producto } from '@/types/productos.types';
import { UUID } from 'crypto';
import { deleteProducto } from '@/services/productos.service';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useDataStore } from '@/store/data.store';
import { useDialog } from '@/hooks/use-dialog';
import { useRouter } from 'next/navigation';

export const AddOrEditProductoDialog = ({
  isEdit,
  data,
}: {
  isEdit?: boolean;
  data?: Producto;
}) => {
  const { open, setOpen, handleOpen } = useDialog();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {!isEdit ? (
          <Button>
            Agregar
            <PackagePlus />
          </Button>
        ) : (
          <Button size={'icon'} variant={'outline'}>
            <PackageOpen />
          </Button>
        )}
      </DrawerTrigger>
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

export const DeleteProductoDialog = ({ id }: { id: UUID }) => {
  const { push } = useRouter();
  const { getProductos } = useDataStore();

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
      await getProductos(access_token);

      toast.success('El producto fue eliminado.');
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message, { className: 'mb-[216px]' });
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size={'icon'} variant={'destructive'}>
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
  );
};
