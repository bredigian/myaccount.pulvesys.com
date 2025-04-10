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
import {
  generateInitPoint,
  unsuscribe,
} from '@/services/suscripciones.service';

import { APIError } from '@/types/error.types';
import { Button } from './ui/button';
import { Check } from 'lucide-react';
import Cookies from 'js-cookie';
import { ReloadIcon } from '@radix-ui/react-icons';
import { UUID } from 'crypto';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/use-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usuarioStore } from '@/store/usuario.store';

export const ManageFacturacionDialog = () => {
  const isMobile = useIsMobile();
  const { open, setOpen, handleOpen } = useDialog();

  const { push } = useRouter();

  const { suscripcion, rol } = usuarioStore();

  const [state, setState] = useState<
    'pending' | 'processing' | 'success' | 'failure'
  >('pending');

  if (rol === 'ADMIN') return null;

  const { free_trial, status, next_payment_date, plan } = suscripcion || {};

  const now = Date.now();
  const endSuscripcionDate = new Date(next_payment_date as string).getTime();

  const isFreeTrialExpired = !free_trial && now > endSuscripcionDate;
  const hasFreeTrial = free_trial && status === 'pending';

  const handleAction = async () => {
    if (status === 'paused') return;

    try {
      setState('processing');

      const access_token = Cookies.get('access_token');
      if (!access_token) {
        toast.error('La sesión ha expirado', { position: 'top-center' });
        push('/');

        return;
      }

      if (isFreeTrialExpired || hasFreeTrial || status === 'cancelled') {
        const { init_point } = await generateInitPoint(
          {
            plan_id: plan?.id as UUID,
            valor_actual: plan?.valor_actual as number,
          },
          access_token,
        );

        push(init_point);
      } else {
        await unsuscribe(access_token);
        await revalidate('suscripciones');
      }

      setState('success');
      setTimeout(() => handleOpen(), 1000);
    } catch (error) {
      setState('failure');
      const { statusCode, message } = error as APIError;

      toast.error(message, { position: 'top-center' });
      const unauthorized = statusCode === 401 || statusCode === 403;
      if (unauthorized) setTimeout(() => push('/'), 250);
    }
  };

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          disabled={status === 'paused'}
          variant={'ghost'}
          className='w-full justify-start pl-2'
        >
          {isFreeTrialExpired || hasFreeTrial
            ? 'Suscribirse'
            : status === 'authorized'
              ? 'Cancelar suscripción'
              : 'Volver a suscribirse'}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {isFreeTrialExpired || hasFreeTrial
              ? 'Suscribirse'
              : status === 'authorized'
                ? 'Cancelar suscripción'
                : 'Volver a suscribirse'}
          </DrawerTitle>
          <DrawerDescription>
            {hasFreeTrial
              ? '¿Querés suscribirte ahora? Recordá que tenés una prueba gratuita de 1 mes. Pulsá el botón para redirigirte a Mercado Pago y realizar el pago.'
              : isFreeTrialExpired
                ? 'Seguí disfrutando de la experiencia de PulveSys. Pulsá el boton para redirigirte a Mercado Pago y realizar el pago.'
                : status === 'authorized'
                  ? '¿Estás seguro? Al cancelar tu suscripción, podrás seguir disfrutando de PulveSys hasta el final del periodo de la suscripción. En caso de que lo desees, podrás suscribirte nuevamente.'
                  : 'Para volver a suscribirte, te llevaremos nuevamente a Mercado Pago para que relices el pago y se registre tu nueva suscrpción.'}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button disabled={state !== 'pending'} onClick={handleAction}>
            {state === 'success' ? (
              <>
                Completado <Check />
              </>
            ) : isFreeTrialExpired || hasFreeTrial ? (
              state === 'processing' ? (
                'Redirigiendo'
              ) : (
                'Ir a Mercado Pago'
              )
            ) : status === 'authorized' ? (
              'Cancelar suscripción'
            ) : state === 'processing' ? (
              'Redirigiendo'
            ) : (
              'Ir a Mercado Pago'
            )}
            {state === 'processing' && <ReloadIcon className='animate-spin' />}
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
        <Button
          disabled={status === 'paused'}
          variant={'ghost'}
          className='w-full justify-start pl-2'
        >
          {isFreeTrialExpired || hasFreeTrial
            ? 'Suscribirse'
            : status === 'authorized'
              ? 'Cancelar suscripción'
              : 'Volver a suscribirse'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isFreeTrialExpired || hasFreeTrial
              ? 'Suscribirse'
              : status === 'authorized'
                ? 'Cancelar suscripción'
                : 'Volver a suscribirse'}
          </DialogTitle>
          <DialogDescription>
            {hasFreeTrial
              ? '¿Querés suscribirte ahora? Recordá que tenés una prueba gratuita de 1 mes. Pulsá el botón para redirigirte a Mercado Pago y realizar el pago.'
              : isFreeTrialExpired
                ? 'Seguí disfrutando de la experiencia de PulveSys. Pulsá el boton para redirigirte a Mercado Pago y realizar el pago.'
                : status === 'authorized'
                  ? '¿Estás seguro? Al cancelar tu suscripción, podrás seguir disfrutando de PulveSys hasta el final del periodo de la suscripción. En caso de que lo desees, podrás suscribirte nuevamente.'
                  : 'Para volver a suscribirte, te llevaremos nuevamente a Mercado Pago para que relices el pago y se registre tu nueva suscrpción.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DialogClose>
          <Button disabled={state !== 'pending'} onClick={handleAction}>
            {state === 'success' ? (
              <>
                Completado <Check />
              </>
            ) : isFreeTrialExpired || hasFreeTrial ? (
              state === 'processing' ? (
                'Redirigiendo'
              ) : (
                'Ir a Mercado Pago'
              )
            ) : status === 'authorized' ? (
              'Cancelar suscripción'
            ) : state === 'processing' ? (
              'Redirigiendo'
            ) : (
              'Ir a Mercado Pago'
            )}
            {state === 'processing' && <ReloadIcon className='animate-spin' />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
