'use client';

import { AddOrEditCampoDialog, DeleteCampoDialog } from './campos-dialog';
import { Campo, Lote } from '@/types/campos.types';
import { Card, CardContent } from './ui/card';

import { Badge } from './ui/badge';
import LoteItem from './lote-item';
import Map from './map';
import { UUID } from 'crypto';

interface Props {
  data: Campo;
}

export default function CampoItem({ data }: Props) {
  const totalHectareas = data.Lote?.reduce(
    (acc, lote) => acc + (lote?.hectareas as number),
    0,
  );

  return (
    <li className='col-span-full flex h-[471.75px] items-start justify-between lg:col-span-2'>
      <Card className='h-full w-full duration-200 ease-in-out hover:bg-sidebar-accent'>
        <CardContent className='flex h-full flex-col gap-4'>
          <div className='flex items-start justify-between pt-6'>
            <div className='space-y-1'>
              <h3 className='max-w-52 truncate text-base font-semibold'>
                {data.nombre}
              </h3>
              <Badge variant={'secondary'}>{totalHectareas}ha</Badge>
            </div>
            <aside className='producto-settings space-x-4'>
              <AddOrEditCampoDialog isEdit data={data} />
              <DeleteCampoDialog id={data.id as UUID} />
            </aside>
          </div>
          <Map lotes={data.Lote as Lote[]} size='!grow' customCenter />
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
