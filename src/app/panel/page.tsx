import {
  AddPulverizacionDialogContainer,
  PulverizacionesContainer,
} from '@/components/pulverizaciones-container';

import Finder from '@/components/finder';
import { Suspense } from 'react';

export default async function Pulverizaciones() {
  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>Crea, modifica y elimina las ordenes de Pulverizacion que desees.</h2>
      <aside id='finder' className='flex items-center gap-4'>
        <Finder />
        <Suspense>
          <AddPulverizacionDialogContainer />
        </Suspense>
      </aside>
      <Suspense>
        <PulverizacionesContainer />
      </Suspense>
    </main>
  );
}
