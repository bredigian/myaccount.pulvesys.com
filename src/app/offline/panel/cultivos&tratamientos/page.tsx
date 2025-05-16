'use client';

import { useEffect, useState } from 'react';

import { Cultivo } from '@/types/cultivos.types';
import { CultivosTratamientosContainerSkeleton } from '@/components/container-skeleton';
import CultivosTratamientosTabs from '@/components/cultivos&tratamientos-tabs';
import { STATE } from '@/types/root.types';
import { Tratamiento } from '@/types/tratamientos.types';

function CultivosTratamientosContainerLoader() {
  const [state, setState] = useState<STATE>('pending');
  const [cultivos, setCultivos] = useState<Cultivo[]>();
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>();

  useEffect(() => {
    const fetchData = async () => {
      setState('processing');

      const cache = await caches.open('api-cache');
      const cachedCultivos = await (await cache.match('/api/cultivos'))?.json();
      const cachedTratamientos = await (
        await cache.match('/api/tratamientos')
      )?.json();
      setCultivos(cachedCultivos);
      setTratamientos(cachedTratamientos);

      setState('success');
    };

    fetchData();
  }, []);

  return state !== 'success' ? (
    <CultivosTratamientosContainerSkeleton />
  ) : (
    <CultivosTratamientosTabs
      cultivos={cultivos!}
      tratamientos={tratamientos!}
    />
  );
}

export default function OfflineCultivosTratamientos() {
  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>
        Administra los cultivos y tratamientos que se utilizan en las
        pulverizaciones.
      </h2>
      <CultivosTratamientosContainerLoader />
    </main>
  );
}
