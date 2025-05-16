'use client';

import { useEffect, useState } from 'react';

import { AddOrEditPulverizacionDialog } from '@/components/pulverizaciones-dialog';
import { AllData } from '@/types/root.types';
import { Button } from '@/components/ui/button';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import PulverizacionesContainerEmpty from '@/components/pulverizaciones-container-empty';
import { PulverizacionesGridContainer } from '@/components/masonry-container';
import { PulverizacionesMasonrySkeleton } from '@/components/masonry-skeleton';
import { ReloadIcon } from '@radix-ui/react-icons';

// import Finder from '@/components/finder';

type STATE = 'pending' | 'loading' | 'completed';

function PulverizacionesContainerLoader() {
  const [state, setState] = useState<STATE>('pending');
  const [data, setData] = useState<Pulverizacion[]>();

  useEffect(() => {
    const fetchData = async () => {
      setState('loading');

      const cache = await caches.open('api-cache');
      const data = await (await cache.match('/api/pulverizaciones'))?.json();
      setData(data);

      setState('completed');
    };

    fetchData();
  }, []);

  return state !== 'completed' ? (
    <PulverizacionesMasonrySkeleton />
  ) : data?.length === 0 ? (
    <PulverizacionesContainerEmpty />
  ) : (
    <PulverizacionesGridContainer data={data!} />
  );
}

export default function OfflinePanel() {
  const [state, setState] = useState<STATE>('pending');
  const [data, setData] = useState<AllData>();

  useEffect(() => {
    const fetchAllLocalData = async () => {
      setState('loading');

      const cache = await caches.open('api-cache');
      const allData: AllData = {
        cultivos: await (await cache.match('/api/cultivos'))?.json(),
        campos: await (await cache.match('/api/campos'))?.json(),
        tratamientos: await (await cache.match('/api/tratamientos'))?.json(),
        productos: await (await cache.match('/api/productos'))?.json(),
      };
      setData(allData);

      setState('completed');
    };

    fetchAllLocalData();
  }, []);

  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>Crea, modifica y elimina las ordenes de pulverizacion que desees.</h2>
      <aside id='finder' className='flex items-center justify-between gap-4'>
        {/* <Finder param='filter' placeholder='Filtrá por ubicación o por fecha' /> */}
        {state !== 'completed' ? (
          <ReloadIcon className='size-4 animate-spin' />
        ) : data ? (
          <AddOrEditPulverizacionDialog data={data} />
        ) : (
          <Button disabled type='button'>
            No disponible
          </Button>
        )}
      </aside>
      <PulverizacionesContainerLoader />
    </main>
  );
}
