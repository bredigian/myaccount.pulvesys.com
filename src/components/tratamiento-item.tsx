'use client';

import {
  AddOrEditTratamientoDialog,
  DeleteTratamientoDialog,
} from './tratamientos-dialog';
import { Card, CardContent } from './ui/card';

import { Tratamiento } from '@/types/tratamientos.types';
import { UUID } from 'crypto';

interface Props {
  data: Tratamiento;
}

export default function TratamientoItem({ data }: Props) {
  return (
    <li className='col-span-full flex items-start justify-between sm:col-span-2 xl:col-span-2'>
      <Card className='w-full duration-200 ease-in-out hover:bg-sidebar-accent'>
        <CardContent className='flex items-center justify-between gap-4 pt-6'>
          <h3 className='truncate text-base font-semibold'>{data.nombre}</h3>
          <aside className='producto-settings flex items-center gap-2'>
            <AddOrEditTratamientoDialog isEdit data={data} />
            <DeleteTratamientoDialog id={data.id as UUID} />
          </aside>
        </CardContent>
      </Card>
    </li>
  );
}
