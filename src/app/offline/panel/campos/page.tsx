'use client';

import { useEffect, useState } from 'react';

import { AddOrEditCampoDialog } from '@/components/campos-dialog';
import { Button } from '@/components/ui/button';
import { Campo } from '@/types/campos.types';
import { CamposGridContainer } from '@/components/masonry-container';
import { CamposMasonrySkeleton } from '@/components/masonry-skeleton';
import { ReloadIcon } from '@radix-ui/react-icons';
import { STATE } from '@/types/root.types';

function CamposContainerLoader() {
  const [state, setState] = useState<STATE>('pending');
  const [data, setData] = useState<Campo[]>();

  useEffect(() => {
    const fetchData = async () => {
      setState('processing');

      const cache = await caches.open('api-cache');
      const data = await (await cache.match('/api/campos'))?.json();

      setData(data);
      setState('success');
    };

    fetchData();
  }, []);

  return state !== 'success' ? (
    <CamposMasonrySkeleton />
  ) : data?.length === 0 ? (
    <p>No has registrado ninguna ubicación aún.</p>
  ) : (
    <CamposGridContainer data={data!} />
  );
}

export default function Campos() {
  const [state, setState] = useState<STATE>('pending');
  const [data, setData] = useState<Campo[]>();

  useEffect(() => {
    const fetchAllLocalData = async () => {
      setState('processing');

      const cache = await caches.open('api-cache');
      const data = await (await cache.match('/api/campos'))?.json();
      setData(data);

      setState('success');
    };

    fetchAllLocalData();
  }, []);

  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>Administra las ubicaciones en los que se realizan los trabajos.</h2>
      <aside id='finder' className='flex items-center justify-between gap-4'>
        {/* <Finder /> */}
        {state !== 'success' ? (
          <ReloadIcon className='size-4 animate-spin' />
        ) : data ? (
          <AddOrEditCampoDialog storedData={data} />
        ) : (
          <Button disabled type='button'>
            No disponible
          </Button>
        )}
      </aside>
      <CamposContainerLoader />
    </main>
  );
}
