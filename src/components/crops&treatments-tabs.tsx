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

import { AddOrEditCropDialog } from './crops-dialog';
import { AddOrEditTreatmentDialog } from './treatments-dialog';
import { Crop } from '@/types/crops.types';
import CropItem from './crop-item';
import Finder from './finder';
import { Treatment } from '@/types/treatments.types';
import TreatmentItem from './treatment-item';
import { useState } from 'react';

type DataTabs = 'cultivos' | 'tratamientos';

interface Props {
  cultivos: Crop[];
  tratamientos: Treatment[];
}

export const CropsTreatmentsTabs = ({ cultivos, tratamientos }: Props) => {
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
            <AddOrEditCropDialog />
          ) : (
            <AddOrEditTreatmentDialog />
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
              <TableHead>Color</TableHead>
              <TableHead className='text-end'>Opciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cultivos.length === 0 ? (
              <TableRow className='h-12'>
                <TableCell>No se encontraron cultivos</TableCell>
              </TableRow>
            ) : (
              cultivos.map((cultivo) => (
                <CropItem key={cultivo.id} data={cultivo} />
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
              tratamientos.map((tratamiento) => (
                <TreatmentItem key={tratamiento.id} data={tratamiento} />
              ))
            )}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
};
