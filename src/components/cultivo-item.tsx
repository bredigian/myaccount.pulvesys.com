'use client';

import { AddOrEditCultivoDialog, DeleteCultivoDialog } from './cultivos-dialog';
import { Card, CardContent } from './ui/card';

import { Cultivo } from '@/types/cultivos.types';
import { UUID } from 'crypto';

interface Props {
  data: Cultivo;
}

export default function CultivoItem({ data }: Props) {
  return (
    <li className='flex items-start justify-between'>
      <Card className='hover:bg-sidebar-accent w-full duration-200 ease-in-out'>
        <CardContent className='flex items-center justify-between pt-6'>
          <h3 className='text-base font-semibold'>{data.nombre}</h3>
          <aside className='producto-settings space-x-4'>
            <AddOrEditCultivoDialog isEdit data={data} />
            <DeleteCultivoDialog id={data.id as UUID} />
          </aside>
        </CardContent>
      </Card>
    </li>
  );
}
