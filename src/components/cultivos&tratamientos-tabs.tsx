'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

import { AddOrEditCultivoDialog } from './cultivos-dialog';
import { AddOrEditTratamientoDialog } from './tratamientos-dialog';
import { Cultivo } from '@/types/cultivos.types';
import CultivoItem from './cultivo-item';
import Finder from './finder';
import { Tratamiento } from '@/types/tratamientos.types';
import TratamientoItem from './tratamiento-item';
import { useState } from 'react';

type DataTabs = 'cultivos' | 'tratamientos';

interface Props {
  cultivos: Cultivo[];
  tratamientos: Tratamiento[];
}

export default function CultivosTratamientosTabs({
  cultivos,
  tratamientos,
}: Props) {
  const [value, setValue] = useState<DataTabs>('cultivos');

  return (
    <Tabs
      onValueChange={() =>
        setValue(value === 'cultivos' ? 'tratamientos' : 'cultivos')
      }
      value={value}
      defaultValue={'tratamientos' as DataTabs}
    >
      <div className='flex w-full flex-col items-start gap-2'>
        <div className='flex w-full items-start justify-between'>
          <TabsList>
            <TabsTrigger value={'cultivos' as DataTabs}>Cultivos</TabsTrigger>
            <TabsTrigger value={'tratamientos' as DataTabs}>
              Tratamientos
            </TabsTrigger>
          </TabsList>
          {value === 'cultivos' ? (
            <AddOrEditCultivoDialog />
          ) : (
            <AddOrEditTratamientoDialog />
          )}
        </div>
        <Finder />
      </div>
      <TabsContent
        value={'cultivos' as DataTabs}
        className='mt-6 flex w-full flex-col items-center gap-4 data-[state=inactive]:mt-0'
      >
        <ul className='grid w-full gap-4 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10'>
          {cultivos.length > 0 ? (
            cultivos.map((cultivo) => (
              <CultivoItem key={cultivo.id} data={cultivo} />
            ))
          ) : (
            <li className='col-span-full pt-4 text-center opacity-75 md:pt-0 md:text-start'>
              No se encontraron cultivos
            </li>
          )}
        </ul>
      </TabsContent>
      <TabsContent
        value={'tratamientos' as DataTabs}
        className='mt-6 flex w-full flex-col items-center gap-4'
      >
        <ul className='grid w-full gap-4 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10'>
          {tratamientos.length > 0 ? (
            tratamientos.map((tratamiento) => (
              <TratamientoItem key={tratamiento.id} data={tratamiento} />
            ))
          ) : (
            <li className='col-span-full pt-4 text-center opacity-75 md:pt-0 md:text-start'>
              No se encontraron tipos de tratamientos
            </li>
          )}
        </ul>
      </TabsContent>
    </Tabs>
  );
}
