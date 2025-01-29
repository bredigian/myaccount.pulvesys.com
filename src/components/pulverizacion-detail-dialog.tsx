'use client';

import { ArrowLeft, Info, PackageOpen } from 'lucide-react';
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

import { AplicacionConConsumo } from '@/types/aplicaciones.types';
import { Button } from './ui/button';
import { DateTime } from 'luxon';
import EditConsumoProductoForm from './pulverizacion-detail-form';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import { useDialog } from '@/hooks/use-dialog';
import { useRouter } from 'next/navigation';

interface Props {
  data?: Pulverizacion;
  defaultValues?: AplicacionConConsumo;
}

export const ShowPulverizacionInfoDialog = ({ data }: Props) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='outline' size={'icon'}>
          <Info />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='z-[9999]'>
        <DrawerHeader>
          <DrawerTitle>Información</DrawerTitle>
          <DrawerDescription className='hidden'></DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-col gap-2 px-4 pb-4 text-sm opacity-75'>
          <p>
            Última vez modificado el{' '}
            {DateTime.fromISO(data?.updatedAt as string).toLocaleString(
              DateTime.DATETIME_SHORT,
              { locale: 'es-AR' },
            )}
          </p>
          <p>
            Creado el{' '}
            {DateTime.fromISO(data?.createdAt as string).toLocaleString(
              DateTime.DATETIME_SHORT,
              { locale: 'es-AR' },
            )}
          </p>
        </div>
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export const BackToPulverizacionesButton = () => {
  const { back } = useRouter();

  return (
    <Button variant={'outline'} onClick={back}>
      Volver <ArrowLeft />
    </Button>
  );
};

export const EditConsumoProductoDialog = ({ defaultValues }: Props) => {
  const { open, setOpen, handleOpen } = useDialog();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={'outline'} size={'icon'}>
          <PackageOpen />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='z-[9999]'>
        <DrawerHeader>
          <DrawerTitle>
            Aplicación de {defaultValues?.producto?.nombre}
          </DrawerTitle>
          <DrawerDescription>
            Modifica con los valores de la aplicación del producto
          </DrawerDescription>
        </DrawerHeader>
        <EditConsumoProductoForm
          defaultValues={defaultValues as AplicacionConConsumo}
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
