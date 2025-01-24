import { AddOrEditTratamientoDialog } from '@/components/tratamientos-dialog';
import Finder from '@/components/finder';
import { Suspense } from 'react';
import TratamientosContainer from '@/components/tratamientos-container';

interface Props {
  searchParams: Promise<{
    nombre: string;
  }>;
}

export default async function Tratamientos({ searchParams }: Props) {
  const { nombre } = await searchParams;

  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>Administra los productos disponibles para las pulverizaciones.</h2>
      <aside id='finder' className='flex items-center gap-4'>
        <Finder />
        <AddOrEditTratamientoDialog />
      </aside>
      <Suspense>
        <TratamientosContainer query={nombre} />
      </Suspense>
    </main>
  );
}
