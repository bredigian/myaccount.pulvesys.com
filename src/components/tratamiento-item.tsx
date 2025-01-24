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
    <li className='flex items-start justify-between'>
      <Card className='hover:bg-sidebar-accent w-full duration-200 ease-in-out'>
        <CardContent className='flex items-center justify-between pt-6'>
          <h3 className='text-base font-semibold'>{data.nombre}</h3>
          <aside className='producto-settings space-x-4'>
            <AddOrEditTratamientoDialog isEdit data={data} />
            <DeleteTratamientoDialog id={data.id as UUID} />
          </aside>
        </CardContent>
      </Card>
    </li>
  );
}
