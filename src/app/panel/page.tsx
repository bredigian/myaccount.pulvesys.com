import FetchDataContainerForAddPulverizacionForm from '@/components/fetch-data-container';
import Finder from '@/components/finder';
import { PulverizacionesContainer } from '@/components/pulverizaciones-container';
import { PulverizacionesMasonrySkeleton } from '@/components/masonry-skeleton';
import { Suspense } from 'react';

interface Props {
  searchParams: Promise<{ filter: string }>;
}

export default async function Pulverizaciones({ searchParams }: Props) {
  const { filter } = await searchParams;

  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>Crea, modifica y elimina las ordenes de pulverizacion que desees.</h2>
      <aside id='finder' className='flex items-center justify-between gap-4'>
        <Finder param='filter' placeholder='Buscar' />
        <FetchDataContainerForAddPulverizacionForm />
      </aside>
      <Suspense fallback={<PulverizacionesMasonrySkeleton />} key={filter}>
        <PulverizacionesContainer query={filter} />
      </Suspense>
    </main>
  );
}
