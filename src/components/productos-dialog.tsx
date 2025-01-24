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
import { PackagePlus, PackageXIcon } from 'lucide-react';

import AddProductoForm from './productos-form';
import { Button } from './ui/button';
import { UUID } from 'crypto';
import { deleteProducto } from '@/services/productos.service';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';

export const AddProductoDialog = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Agregar
          <PackagePlus />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Nuevo producto</DrawerTitle>
          <DrawerDescription>
            Completa con las caracteristicas del producto
          </DrawerDescription>
        </DrawerHeader>
        <AddProductoForm />
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
  const handleDelete = async () => {
    try {
      await deleteProducto(id);
      await revalidate('productos');

      toast.success('El producto fue eliminado.');
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
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
