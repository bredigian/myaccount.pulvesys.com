import {
  CalendarIcon,
  CalendarSync,
  CalendarXIcon,
  ChevronRight,
  Gift,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { RedirectType, redirect } from 'next/navigation';

import { Badge } from './ui/badge';
import { DateTime } from 'luxon';
import { STATUS } from '@/types/suscripciones.types';
import { cn } from '@/lib/utils';
import { cookies } from 'next/headers';
import { getSuscripcion } from '@/services/suscripciones.service';

export default async function FacturacionContainer() {
  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');
  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  const data = await getSuscripcion(access_token.value, refresh_token);
  if ('error' in data) {
    const { statusCode } = data;

    if (statusCode === 404) redirect('/', RedirectType.replace);
    else return <p>{data?.message}</p>;
  }

  const { plan, fecha_fin, status, free_trial, createdAt, updatedAt, extra } =
    data;

  if (plan.nombre === 'ADMIN')
    return (
      <p>
        Proximamente visualizarás información de las suscripciones de tus
        clientes.
      </p>
    );

  const now = Date.now();
  const endSuscripcionDate = new Date(fecha_fin as string).getTime();

  const isFreeTrialExpired = !free_trial && now > endSuscripcionDate;
  const isNotUpdatedYet = status === 'authorized' && isFreeTrialExpired;

  const endDateString = DateTime.fromISO(fecha_fin as string).toLocaleString(
    DateTime.DATE_FULL,
    { locale: 'es-AR' },
  );
  const willFinish = !free_trial && status === 'cancelled';
  const isExpired =
    status === 'cancelled' && Date.now() > new Date(fecha_fin).getTime();

  return (
    <Card className='md:max-w-lg'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between gap-4'>
          <h2 className='md:text-lg lg:text-xl'>Plan {plan.nombre}</h2>
          <span className='flex items-center gap-1 rounded-md bg-primary/60 px-2 py-1 font-medium text-primary-foreground md:text-lg lg:text-xl'>
            ${plan.valor.toLocaleString('es-AR')}/mes
          </span>
        </CardTitle>
        <CardDescription>
          <ul className='flex flex-col gap-2'>
            {plan.descripcion.map((item) => (
              <li
                key={`description-item-${item}`}
                className='flex items-center gap-1'
              >
                <ChevronRight size={16} />
                {item}
              </li>
            ))}
          </ul>
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <Badge
          variant={status === 'cancelled' ? 'destructive' : 'default'}
          className={cn(
            'w-fit text-primary-foreground dark:text-primary md:text-base',
            status === 'pending'
              ? 'bg-yellow-200 !text-primary hover:!text-primary-foreground dark:!text-primary-foreground'
              : status === 'authorized'
                ? 'bg-green-600'
                : status === 'paused'
                  ? 'bg-orange-400 !text-primary-foreground dark:!text-primary-foreground'
                  : '',
          )}
        >
          {STATUS[status]}
        </Badge>
        <h5 className='flex items-start gap-1 text-sm md:text-base'>
          {isExpired ? (
            <>
              <CalendarIcon className='mt-0.5 size-4 shrink-0 md:mt-0 md:size-6' />
              <p>La suscripción finalizó el {endDateString}</p>
            </>
          ) : isNotUpdatedYet ? (
            <>
              <CalendarIcon className='mt-0.5 size-4 shrink-0 md:mt-0 md:size-6' />
              <p>La suscripción se renovará dentro de las próximas horas</p>
            </>
          ) : status === 'paused' ? (
            <p className='rounded-md border-2 border-primary/20 bg-orange-200 px-2 py-1 text-sm text-primary/75 dark:border-primary-foreground/20 dark:text-primary-foreground md:text-base'>
              Tu suscripción fue pausada debido a varios intentos fallidos de
              realizar el cobro.
            </p>
          ) : isFreeTrialExpired ? (
            <>
              <CalendarIcon className='mt-0.5 size-4 shrink-0 md:mt-0 md:size-6' />
              <p>La prueba gratuita finalizó el {endDateString}</p>
            </>
          ) : !willFinish ? (
            <>
              {free_trial ? (
                <Gift className='mt-0.5 size-4 shrink-0 md:mt-0 md:size-6' />
              ) : (
                <CalendarSync className='mt-0.5 size-4 shrink-0 md:mt-0 md:size-6' />
              )}
              <p className='flex items-center gap-1'>
                {free_trial
                  ? 'Tenés una prueba gratuita hasta '
                  : 'Se renueva '}
                el {endDateString}
              </p>
            </>
          ) : (
            <>
              <CalendarXIcon className='mt-0.5 size-4 shrink-0 md:mt-0 md:size-6' />
              <p>
                Podés seguir utilizando el servicio hasta el{' '}
                <strong>{endDateString}</strong>
              </p>
            </>
          )}
        </h5>
        {extra?.semaphore === 'yellow' && status !== 'paused' && (
          <div className='flex flex-col gap-2'>
            <p className='w-fit rounded-md border-2 border-primary/20 bg-yellow-200 px-2 py-1 text-xs font-semibold text-primary/75 dark:border-primary-foreground/20 dark:text-primary-foreground md:text-sm'>
              Hay conflictos con el pago y requiere de tu atención.
            </p>
            <p className='w-fit rounded-md border-2 border-primary/20 bg-yellow-200 px-2 py-1 text-xs font-semibold text-primary/75 dark:border-primary-foreground/20 dark:text-primary-foreground'>
              Última vez cobrado el{' '}
              {DateTime.fromISO(
                extra?.last_charged_date as string,
              ).toLocaleString(DateTime.DATETIME_SHORT, { locale: 'es-AR' })}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className='flex flex-col items-start gap-2 opacity-75'>
        <p className='text-sm'>
          Creada el{' '}
          {DateTime.fromISO(createdAt as string).toLocaleString(
            DateTime.DATETIME_SHORT,
            { locale: 'es-AR' },
          )}
        </p>
        <p className='text-sm'>
          Actualizada el{' '}
          {DateTime.fromISO(updatedAt as string).toLocaleString(
            DateTime.DATETIME_SHORT,
            { locale: 'es-AR' },
          )}
        </p>
      </CardFooter>
    </Card>
  );
}
