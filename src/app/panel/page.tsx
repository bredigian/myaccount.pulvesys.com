import { AddOrEditPulverizacionDialog } from '@/components/pulverizaciones-dialog';
import Finder from '@/components/finder';
import { PulverizacionesContainer } from '@/components/pulverizaciones-container';
import { Suspense } from 'react';

export default function Pulverizaciones() {
  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>Crea, modifica y elimina las ordenes de Pulverizacion que desees.</h2>
      <aside id='finder' className='flex items-center gap-4'>
        <Finder />
        <AddOrEditPulverizacionDialog />
      </aside>
      <Suspense>
        <PulverizacionesContainer />
      </Suspense>
    </main>
  );
}
