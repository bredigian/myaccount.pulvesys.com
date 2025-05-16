'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className='text-end'>Opciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cultivos.length === 0 ? (
              <TableRow className='h-12'>
                <TableCell>No se encontraron cultivos</TableCell>
              </TableRow>
            ) : (
              cultivos.map((cultivo, index) => (
                <CultivoItem
                  key={cultivo.id ?? `cultivo__cached-${index}`}
                  data={cultivo}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TabsContent>
      <TabsContent
        value={'tratamientos' as DataTabs}
        className='mt-6 flex w-full flex-col items-center gap-4'
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className='text-end'>Opciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tratamientos.length === 0 ? (
              <TableRow className='h-12'>
                <TableCell>No se encontraron tratamientos</TableCell>
              </TableRow>
            ) : (
              tratamientos.map((tratamiento, index) => (
                <TratamientoItem
                  key={tratamiento.id ?? `tratamiento__cached-${index}`}
                  data={tratamiento}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}
