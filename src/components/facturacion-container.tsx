import { CalendarSync, CalendarXIcon, ChevronRight, Gift } from 'lucide-react';
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

  const { plan, fecha_fin, status, free_trial, createdAt, updatedAt } = data;

  const endDateString = DateTime.fromISO(fecha_fin as string).toLocaleString(
    DateTime.DATE_FULL,
    { locale: 'es-AR' },
  );
  const willFinish = !free_trial && status === 'cancelled';

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between gap-4'>
          <h2>Plan {plan.nombre}</h2>
          <span className='flex items-center gap-1 rounded-md bg-primary/60 px-2 py-1 font-medium text-primary-foreground'>
            ${plan.valor.toLocaleString('es-AR')}
          </span>
        </CardTitle>
        <CardDescription>
          <ul>
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
      <CardContent className='flex flex-col gap-2'>
        <Badge
          variant={status === 'cancelled' ? 'destructive' : 'default'}
          className={cn(
            'w-fit text-primary dark:text-primary-foreground',
            status === 'pending'
              ? 'bg-yellow-200'
              : status === 'authorized'
                ? 'bg-green-600'
                : '',
          )}
        >
          {STATUS[status]}
        </Badge>
        <h5 className='flex items-start gap-1 text-sm'>
          {!willFinish ? (
            <>
              {free_trial ? (
                <Gift size={16} className='mt-0.5 shrink-0' />
              ) : (
                <CalendarSync size={16} className='mt-0.5 shrink-0' />
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
              <CalendarXIcon size={16} className='mt-0.5 shrink-0' />
              <p>
                Podés seguir utilizando el servicio hasta el{' '}
                <strong>{endDateString}</strong>
              </p>
            </>
          )}
        </h5>
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
