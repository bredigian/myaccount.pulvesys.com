'use client';

import { AddOrEditCampoDialog, DeleteCampoDialog } from './campos-dialog';
import { Campo, Lote } from '@/types/campos.types';
import { Card, CardContent } from './ui/card';

import { Badge } from './ui/badge';
import LoteItem from './lote-item';
import MapboxMap from './map';
import { UUID } from 'crypto';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { useState } from 'react';

interface Props {
  data: Campo;
}

export default function CampoItem({ data }: Props) {
  const totalHectareas = data.Lote?.reduce(
    (acc, lote) => acc + (lote?.hectareas as number),
    0,
  );

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(!show);

  return (
    <li className='col-span-full flex h-fit items-start justify-between lg:col-span-2'>
      <Card className='h-full w-full duration-200 ease-in-out'>
        <CardContent className='flex h-full flex-col gap-4 pt-6'>
          <div className='flex items-center justify-between gap-4'>
            <h3 className='max-w-52 truncate text-base font-semibold'>
              {data.nombre}
            </h3>
            <aside className='producto-settings flex items-center gap-2'>
              <AddOrEditCampoDialog isEdit data={data} />
              <DeleteCampoDialog id={data.id as UUID} />
            </aside>
          </div>
          <div className='flex items-center justify-between gap-4'>
            <Badge variant={'secondary'}>{totalHectareas}ha</Badge>
            <div className='flex items-center space-x-2'>
              <Switch onClick={handleShow} id={`show-map-${data.id}`} />
              <Label
                className='hover:cursor-pointer'
                htmlFor={`show-map-${data.id}`}
              >
                Mapa
              </Label>
            </div>
          </div>
          {show && (
            <MapboxMap
              lotesCampo={data.Lote as Lote[]}
              lotesPulverizados={data.Lote as Lote[]}
              size='!h-[20dvh]'
              customZoom={13}
            />
          )}
          <ul className='flex flex-wrap items-start gap-2'>
            {data.Lote?.map((lote) => (
              <LoteItem key={`lote-${lote.id}`} lote={lote} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </li>
  );
}
