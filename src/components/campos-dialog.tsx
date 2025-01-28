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
import { UUID } from 'crypto';
import { deleteCampo } from '@/services/campos.service';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useState } from 'react';

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
  const [open, setOpen] = useState(false);

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
            {!isEdit ? 'Nuevo campo' : 'Modificar campo'}
          </DrawerTitle>
          <DrawerDescription>
            Completa con las caracteristicas del campo
          </DrawerDescription>
        </DrawerHeader>
        <AddOrEditCampoForm isEdit={isEdit} data={data} />
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
  const handleDelete = async () => {
    try {
      await deleteCampo(id);
      await revalidate('campos');

      toast.success('El campo fue eliminado.');
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
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
