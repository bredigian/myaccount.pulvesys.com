'use client';

import { Pulverizacion } from '@/types/pulverizaciones.types';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import PulverizacionItem from './pulverizacion-item';

interface Props {
  data: Pulverizacion[];
}

export default function PulverizacionesGridContainer({ data }: Props) {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 350: 1, 768: 3, 1024: 4, 1280: 5, 1536: 6 }}
    >
      <Masonry gutter='16px'>
        {data.length > 0 ? (
          data.map((pulverizacion) => (
            <PulverizacionItem
              key={pulverizacion.id}
              pulverizacion={pulverizacion}
            />
          ))
        ) : (
          <li className='col-span-full pt-4 text-center opacity-75 md:pt-0 md:text-start'>
            No se encontraron pulverizaciones
          </li>
        )}
      </Masonry>
    </ResponsiveMasonry>
  );
}
