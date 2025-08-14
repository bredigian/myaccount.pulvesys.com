'use client';

import { CheckIcon, UserPen, UserPlus, UserX } from 'lucide-react';
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
import { AddOrEditUserForm } from './users-form';
import { Button } from './ui/button';
import Cookies from 'js-cookie';
import { ReloadIcon } from '@radix-ui/react-icons';
import { UUID } from 'crypto';
import { User } from '@/types/users.types';
import { cn } from '@/lib/utils';
import { deleteUser } from '@/services/users.service';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/use-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';

export const AddOrEditUserDialog = ({
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
  data?: User;
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
    <Drawer open={customOpen ?? open} onOpenChange={customSetOpen ?? setOpen}>
      {!hidden && (
        <DrawerTrigger asChild>
          {!isEdit ? (
            <Button
              variant={variant ?? 'default'}
              className={className}
              size={!onlyIcon ? 'default' : 'icon'}
            >
              {!onlyIcon && 'Agregar'}
              <UserPlus />
            </Button>
          ) : (
            <Button size={'sm'} variant={'outline'}>
              Modificar <UserPen />
            </Button>
          )}
        </DrawerTrigger>
      )}
      <DrawerContent className='h-auto'>
        <DrawerHeader>
          <DrawerTitle>
            {!isEdit ? 'Nuevo usuario' : 'Modificar usuario'}
          </DrawerTitle>
          <DrawerDescription>
            Completá con los datos del usuario
          </DrawerDescription>
        </DrawerHeader>
        <AddOrEditUserForm
          isEdit={isEdit}
          data={data}
          handleOpen={customHandleOpen ?? handleOpen}
        />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={customOpen ?? open} onOpenChange={customSetOpen ?? setOpen}>
      {!hidden && (
        <DialogTrigger asChild>
          {!isEdit ? (
            <Button
              variant={variant ?? 'default'}
              className={className}
              size={!onlyIcon ? 'default' : 'icon'}
            >
              {!onlyIcon && 'Agregar'}
              <UserPlus />
            </Button>
          ) : (
            <Button size={'sm'} variant={'outline'}>
              Modificar <UserPen />
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className='h-auto !w-[800px]'>
        <DialogHeader>
          <DialogTitle>
            {!isEdit ? 'Nuevo usuario' : 'Modificar usuario'}
          </DialogTitle>
          <DialogDescription>
            Completá con los datos del usuario
          </DialogDescription>
        </DialogHeader>
        <AddOrEditUserForm
          isEdit={isEdit}
          data={data}
          handleOpen={customHandleOpen ?? handleOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

type State = 'pending' | 'processing' | 'success' | 'error';

export const DeleteUserDialog = ({ id }: { id: UUID }) => {
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

      await deleteUser(id, access_token);

      setState('success');

      setTimeout(async () => {
        handleOpen();
        await revalidate('usuarios');
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
          <UserX />
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
          <UserX />
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
