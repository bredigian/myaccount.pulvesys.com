import { useIsMobile } from '@/hooks/use-mobile';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from './ui/dialog';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from './ui/drawer';
import { Button } from './ui/button';
import { Lote } from '@/types/campos.types';
import { CheckIcon, Trash } from 'lucide-react';
import { toast } from 'sonner';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteLote } from '@/services/campos.service';
import { UUID } from 'crypto';
import revalidate from '@/lib/actions';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useDialog } from '@/hooks/use-dialog';

interface Props {
  data: Lote;
}

type State = 'pending' | 'success' | 'processing' | 'error';

export const DeleteStoredLoteDialog = ({ data }: Props) => {
  const { open, setOpen, handleOpen } = useDialog();

  const isMobile = useIsMobile();
  const { push } = useRouter();
  const [state, setState] = useState<State>('pending');

  const handleDelete = async () => {
    try {
      setState('processing');
      const access_token = Cookies.get('access_token');
      if (!access_token) {
        toast.error('La sesión ha expirado', { position: 'top-center' });
        push('/');

        return;
      }

      await deleteLote(data.id as UUID, access_token);
      setState('success');

      setTimeout(async () => {
        handleOpen();
        await revalidate('campos');
      }, 1000);
    } catch (e) {
      if (e instanceof Error)
        toast.error(e.message, { position: 'top-center' });
      setState('error');
      setTimeout(() => {
        setState('pending');
      }, 1000);
    }
  };

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type='button'
          style={{
            borderColor: data.color as string,
            backgroundColor: `${data.color}75` as string,
          }}
          className='h-full rounded-md rounded-l-none border-2 px-2 py-[5px] text-black'
        >
          <Trash size={14} />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás seguro?</DrawerTitle>
          <DrawerDescription>
            Es posible que el lote {data.nombre} ya esté registrado en alguna
            pulverización
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className=''>
          <Button
            disabled={state === 'processing' || state === 'success'}
            variant={'destructive'}
            onClick={handleDelete}
            className={
              state === 'success' ? '!bg-green-700 disabled:opacity-100' : ''
            }
          >
            {state === 'pending' || state === 'error' ? (
              'Eliminar'
            ) : state === 'processing' ? (
              <>
                Procesando
                <ReloadIcon className='animate-spin' />
              </>
            ) : (
              <>
                Completado <CheckIcon />
              </>
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
        <button
          type='button'
          style={{
            borderColor: data.color as string,
            backgroundColor: `${data.color}75` as string,
          }}
          className='h-full rounded-md rounded-l-none border-2 px-2 py-[5px] text-black'
        >
          <Trash size={14} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás seguro?</DialogTitle>
          <DialogDescription>
            Es posible que el lote {data.nombre} ya esté registrado en alguna
            pulverización
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className=''>
          <Button
            disabled={state === 'processing' || state === 'success'}
            variant={'destructive'}
            onClick={handleDelete}
            className={
              state === 'success' ? '!bg-green-700 disabled:opacity-100' : ''
            }
          >
            {state === 'pending' || state === 'error' ? (
              'Eliminar'
            ) : state === 'processing' ? (
              <>
                Procesando
                <ReloadIcon className='animate-spin' />
              </>
            ) : (
              <>
                Completado <CheckIcon />
              </>
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
