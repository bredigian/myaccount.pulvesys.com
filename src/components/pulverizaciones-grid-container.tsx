'use client';

import { Pulverizacion } from '@/types/pulverizaciones.types';
import PulverizacionItem from './pulverizacion-item';
import { Masonry } from './masonry';
import { useSidebar } from './ui/sidebar';
import { ReloadIcon } from '@radix-ui/react-icons';

interface Props {
  data: Pulverizacion[];
}

export default function PulverizacionesGridContainer({ data }: Props) {
  useSidebar();
  return (
    <Masonry
      items={data}
      config={{
        columns: [1, 2, 3, 4, 5],
        gap: [16, 16, 16, 16, 16],
        media: [768, 1024, 1280, 1400, 1536],
      }}
      render={(pulverizacion) => (
        <PulverizacionItem
          key={pulverizacion.id}
          pulverizacion={pulverizacion}
        />
      )}
      placeholder={
        <div className='grid h-full place-items-center'>
          <ReloadIcon className='size-6 animate-spin' />
        </div>
      }
    />
  );
}
