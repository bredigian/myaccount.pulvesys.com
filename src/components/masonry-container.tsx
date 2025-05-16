'use client';

import {
  CamposMasonrySkeleton,
  PulverizacionesMasonrySkeleton,
} from './masonry-skeleton';

import { Campo } from '@/types/campos.types';
import CampoItem from './campo-item';
import { Masonry } from './masonry';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import PulverizacionItem from './pulverizacion-item';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const PulverizacionesGridContainer = ({
  data,
}: {
  data: Pulverizacion[];
}) => {
  const pathname = usePathname();

  const saveDataToLocal = async () => {
    const cache = await caches.open('api-cache');
    await cache.put('/api/pulverizaciones', new Response(JSON.stringify(data)));
  };

  useEffect(() => {
    if (!pathname.includes('offline')) saveDataToLocal();
  }, [data]);

  return (
    <Masonry
      items={data}
      config={{
        columns: [1, 2, 3, 4, 5],
        gap: [16, 16, 16, 16, 16],
        media: [768, 1024, 1280, 1400, 1536],
      }}
      render={(pulverizacion, index) => (
        <PulverizacionItem
          key={pulverizacion.id || `pulverizacion_no_stored_${index}`}
          pulverizacion={pulverizacion}
        />
      )}
      placeholder={<PulverizacionesMasonrySkeleton />}
    />
  );
};

export const CamposGridContainer = ({ data }: { data: Campo[] }) => {
  return (
    <Masonry
      items={data}
      config={{
        columns: [1, 2, 3, 5],
        gap: [16, 16, 16, 16],
        media: [768, 1280, 1400, 1536],
      }}
      render={(pulverizacion) => (
        <CampoItem key={pulverizacion.id} data={pulverizacion} />
      )}
      placeholder={<CamposMasonrySkeleton />}
    />
  );
};
