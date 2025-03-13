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

import { Button } from './ui/button';
import Cookies from 'js-cookie';
import { LogOut } from 'lucide-react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { signout } from '@/services/auth.service';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/use-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usuarioStore } from '@/store/usuario.store';
import { APIError } from '@/types/error.types';

type State = 'pending' | 'success' | 'error';

export default function LogoutDialog() {
  const { open, setOpen } = useDialog();
  const { push } = useRouter();
  const { clearUserdata } = usuarioStore();

  const [state, setState] = useState<undefined | State>(undefined);

  const handleLogout = async () => {
    try {
      setState('pending');

      const access_token = Cookies.get('access_token');
      if (!access_token) {
        push(`/?session=${access_token}&expired=true`);
        return;
      }

      await signout(access_token);
      clearUserdata();

      setState('success');
      setTimeout(() => push('/'), 500);
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
        <Button variant={'destructive'} size={'icon'}>
          <LogOut />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás seguro?</DrawerTitle>
          <DrawerDescription>Se cerrará la sesión</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className=''>
          <Button
            disabled={state === 'pending' || state === 'success'}
            variant={'destructive'}
            onClick={handleLogout}
            className={cn(
              'disabled:opacity-100',
              state === 'success' && '!bg-green-700',
            )}
          >
            {state === undefined ? (
              <>Salir</>
            ) : state === 'pending' ? (
              <>
                Saliendo <ReloadIcon className='animate-spin' />
              </>
            ) : (
              state === 'success' && (
                <>
                  Sesión cerrada. Redirigiendo{' '}
                  <ReloadIcon className='animate-spin' />
                </>
              )
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant={'outline'}>Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'destructive'} size={'icon'}>
          <LogOut />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás seguro?</DialogTitle>
          <DialogDescription>Se cerrará la sesión</DialogDescription>
        </DialogHeader>
        <DialogFooter className=''>
          <Button
            disabled={state === 'pending' || state === 'success'}
            variant={'destructive'}
            onClick={handleLogout}
            className={cn(
              'disabled:opacity-100',
              state === 'success' && '!bg-green-700',
            )}
          >
            {state === undefined ? (
              <>Salir</>
            ) : state === 'pending' ? (
              <>
                Saliendo <ReloadIcon className='animate-spin' />
              </>
            ) : (
              state === 'success' && (
                <>
                  Sesión cerrada. Redirigiendo{' '}
                  <ReloadIcon className='animate-spin' />
                </>
              )
            )}
          </Button>
          <DialogClose asChild>
            <Button variant={'outline'}>Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
