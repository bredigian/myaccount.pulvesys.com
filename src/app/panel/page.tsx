import { AddOrEditPulverizacionDialog } from '@/components/pulverizaciones-dialog';
import Finder from '@/components/finder';
import { PulverizacionesContainer } from '@/components/pulverizaciones-container';
import { Suspense } from 'react';

interface Props {
  searchParams: Promise<{ filter: string }>;
}

export default async function Pulverizaciones({ searchParams }: Props) {
  const { filter } = await searchParams;

  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>Crea, modifica y elimina las ordenes de Pulverizacion que desees.</h2>
      <aside id='finder' className='flex items-center justify-between gap-4'>
        <Finder param='filter' placeholder='Filtrá por ubicación o por fecha' />
        <AddOrEditPulverizacionDialog />
      </aside>
      <Suspense>
        <PulverizacionesContainer query={filter} />
      </Suspense>
    </main>
  );
}
