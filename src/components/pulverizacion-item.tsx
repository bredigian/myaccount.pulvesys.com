import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Leaf, ListCheckIcon, Tag } from 'lucide-react';

import { Badge } from './ui/badge';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { Lote } from '@/types/campos.types';
import LoteItem from './lote-item';
import { Pulverizacion } from '@/types/pulverizaciones.types';

interface Props {
  pulverizacion: Pulverizacion;
}

export default function PulverizacionItem({ pulverizacion }: Props) {
  return (
    <li className='flex items-start justify-between'>
      <Link
        href={`/panel/pulverizacion?id=${pulverizacion.id}`}
        className='w-full'
      >
        <Card className='h-full w-full duration-200 ease-in-out hover:cursor-pointer hover:bg-secondary'>
          <CardHeader>
            <CardTitle className='flex items-start justify-between gap-4'>
              <h4 className='truncate text-base font-semibold'>
                {pulverizacion.detalle.campo?.nombre}
              </h4>
              <p className='w-fit text-end text-sm font-normal'>
                {DateTime.fromISO(pulverizacion.fecha as string).toLocaleString(
                  DateTime.DATE_MED_WITH_WEEKDAY,
                  {
                    locale: 'es-AR',
                  },
                )}
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-start justify-between'>
              <ul className='flex flex-wrap items-start gap-2 overflow-hidden'>
                {pulverizacion?.detalle?.lotes?.map((lote, index) => {
                  const loteData = pulverizacion.detalle.campo?.Lote?.find(
                    (item) => item.nombre === lote,
                  ) as Lote;

                  return !loteData ? (
                    <div
                      key={`lote-empty-${index}`}
                      className='flex items-center gap-1 overflow-hidden rounded-md border-2 bg-yellow-200 px-3 py-1 text-xs font-semibold hover:cursor-pointer'
                    >
                      <Tag size={14} />
                      <span className='truncate'>Lote no disponible</span>
                    </div>
                  ) : (
                    <LoteItem
                      key={`lote-${loteData.id ?? 'empty'}`}
                      lote={loteData}
                    />
                  );
                })}
              </ul>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Badge variant={'secondary'} className='space-x-1'>
                <Leaf size={14} />
                <h6>{pulverizacion.detalle.cultivo?.nombre}</h6>
              </Badge>
              <Badge variant={'secondary'} className='space-x-1'>
                <ListCheckIcon size={14} />
                <h6>{pulverizacion.detalle.tratamiento?.nombre}</h6>
              </Badge>
            </div>
            <ul className='flex flex-wrap items-center gap-2'>
              {pulverizacion.Aplicacion?.map((aplicacion) => (
                <li key={`pulverizacion-aplicacion__${aplicacion.id}`}>
                  <Badge variant={'secondary'}>
                    {aplicacion.producto?.nombre}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Link>
    </li>
  );
}
