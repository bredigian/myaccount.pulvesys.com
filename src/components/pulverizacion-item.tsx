import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Leaf, ListCheckIcon, Tag } from 'lucide-react';

import { Badge } from './ui/badge';
import { DateTime } from 'luxon';
import { Lote } from '@/types/campos.types';
import { Pulverizacion } from '@/types/pulverizaciones.types';

interface Props {
  pulverizacion: Pulverizacion;
}

export default function PulverizacionItem({ pulverizacion }: Props) {
  return (
    <li>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            {pulverizacion.detalle.campo?.nombre}
            <p className='text-sm font-normal'>
              {DateTime.fromISO(pulverizacion.fecha as string).toLocaleString(
                DateTime.DATE_MED_WITH_WEEKDAY,
                {
                  locale: 'es-AR',
                },
              )}
            </p>
          </CardTitle>
          <CardContent className='flex items-center justify-between px-0 py-0 pt-2'>
            <ul className='flex flex-wrap items-center gap-2'>
              {pulverizacion.detalle.lotes.map((lote) => {
                const loteData = pulverizacion.detalle.campo?.Lote?.find(
                  (item) => item.nombre === lote,
                ) as Lote;

                return (
                  <li
                    key={`lote-${loteData.id}`}
                    style={{
                      backgroundColor: `${loteData.color as string}50`,
                      borderColor: loteData.color as string,
                    }}
                    className='flex items-center gap-1 rounded-md border-2 px-3 py-1 text-xs font-semibold'
                  >
                    <Tag size={14} />
                    {loteData.nombre}
                  </li>
                );
              })}
            </ul>
            <Badge variant={'secondary'}>
              {pulverizacion.detalle.hectareas}ha/
              {pulverizacion.detalle.campo?.hectareas}ha
            </Badge>
          </CardContent>
        </CardHeader>
        <CardContent>
          <div className='space-x-4'>
            <Badge variant={'secondary'} className='space-x-1'>
              <Leaf size={14} />
              <h6>{pulverizacion.detalle.cultivo?.nombre}</h6>
            </Badge>
            <Badge variant={'secondary'} className='space-x-1'>
              <ListCheckIcon size={14} />
              <h6>{pulverizacion.detalle.tratamiento?.nombre}</h6>
            </Badge>
          </div>
        </CardContent>
        <CardFooter>
          <ul className='flex flex-wrap items-center gap-4'>
            {pulverizacion.Aplicacion?.map((aplicacion) => (
              <li key={`pulverizacion-aplicacion__${aplicacion.id}`}>
                <Badge variant={'secondary'}>
                  {aplicacion.producto?.nombre}
                </Badge>
              </li>
            ))}
          </ul>
        </CardFooter>
      </Card>
    </li>
  );
}
