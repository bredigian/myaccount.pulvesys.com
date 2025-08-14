import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './ui/drawer';

import { Button } from './ui/button';
import Cookies from 'js-cookie';
import { DateTime } from 'luxon';
import { SUBSCRIPTION_MESSAGE } from '@/types/subscriptions.types';
import { handleInformationMessage } from '@/services/subscriptions.service';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/use-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';

interface Props {
  message_info: keyof typeof SUBSCRIPTION_MESSAGE;
  next_payment_date: string;
}

export default function ScreenDialog({
  message_info,
  next_payment_date,
}: Props) {
  const isMobile = useIsMobile();

  const { push } = useRouter();

  const { open, handleOpen } = useDialog(true);

  const endDate = DateTime.fromISO(next_payment_date).toLocaleString(
    DateTime.DATE_SHORT,
    { locale: 'es-AR' },
  );

  const disableInformationMessage = async () => {
    try {
      handleOpen();
      const access_token = Cookies.get('access_token');
      if (!access_token) {
        toast.error('La sesión ha expirado', { position: 'top-center' });
        push('/');

        return;
      }
      await handleInformationMessage('disabled', access_token);
      await revalidate('suscripciones');
    } catch (error) {
      console.error(error);
    }
  };

  return !isMobile ? (
    <Dialog open={open} onOpenChange={() => disableInformationMessage()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{SUBSCRIPTION_MESSAGE[message_info]}</DialogTitle>
          <DialogDescription>
            {message_info === 'welcome'
              ? `Comenzá a disfrutar de tu suscripción de inmediato. Tenés acceso a todas las funcionalidades de la plataforma mediante una prueba gratuita hasta el ${endDate}.`
              : message_info === 'warning'
                ? 'Tu prueba de 30 días ha finalizado. Suscribite para seguir disfrutando de las funcionalidades de PulveSys.'
                : message_info === 'payment_warning'
                  ? 'Hay conflictos con el pago de tu suscripción. Por favor, revisá y regularizá tus métodos de pago para no perder acceso a las funcionalidades de PulveSys.'
                  : message_info === 'paused'
                    ? 'Tu suscripción fue pausada temporalmente. Regularizá tus pagos para evitar una posible cancelación y volvé a disfrutar de las funcionalidades de PulveSys. Si ya lo hiciste, Mercado Pago intentará realizar el cobro automáticamente en las siguientes horas.'
                    : `Lamentamos que hayas tomado esa decisión. Si cambias de opinión, podés reactivarla en cualquier momento. Podés seguir usando el servicio hasta el ${endDate}.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={() => disableInformationMessage()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{SUBSCRIPTION_MESSAGE[message_info]}</DrawerTitle>
          <DrawerDescription>
            {message_info === 'welcome'
              ? `Comenzá a disfrutar de tu suscripción de inmediato. Tenés acceso a todas las funcionalidades de la plataforma mediante una prueba gratuita hasta el ${endDate}.`
              : message_info === 'warning'
                ? 'Tu prueba de 30 días ha finalizado. Suscribite para seguir disfrutando de las funcionalidades de PulveSys.'
                : message_info === 'payment_warning'
                  ? 'Hay conflictos con el pago de tu suscripción. Por favor, revisá y regularizá tus métodos de pago para no perder acceso a las funcionalidades de PulveSys.'
                  : message_info === 'paused'
                    ? 'Tu suscripción fue pausada temporalmente. Regularizá tus pagos para evitar una posible cancelación y volvé a disfrutar de las funcionalidades de PulveSys. Si ya lo hiciste, Mercado Pago intentará realizar el cobro automáticamente en las siguientes horas.'
                    : `Lamentamos que hayas tomado esa decisión. Si cambias de opinión, podés reactivarla en cualquier momento. Podés seguir usando el servicio hasta el ${endDate}.`}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
