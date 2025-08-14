'use client';

import {
  LocationsMasonrySkeleton,
  SpraysMasonrySkeleton,
} from './masonry-skeleton';

import { Campo } from '@/types/locations.types';
import { Cultivo } from '@/types/crops.types';
import LocationItem from './location-item';
import { Masonry } from './masonry';
import { Pulverizacion } from '@/types/sprays.types';
import PulverizacionItem from './spray-item';

export const SpraysGridContainer = ({ data }: { data: Pulverizacion[] }) => {
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
      placeholder={<SpraysMasonrySkeleton />}
    />
  );
};

export const LocationsGridContainer = ({
  data,
  cultivos,
  pulverizaciones,
}: {
  data: Campo[];
  cultivos: Cultivo[];
  pulverizaciones: Pulverizacion[];
}) => {
  return (
    <Masonry
      items={data}
      config={{
        columns: [1, 2, 3, 5],
        gap: [16, 16, 16, 16],
        media: [768, 1280, 1400, 1536],
      }}
      render={(pulverizacion) => (
        <LocationItem
          key={pulverizacion.id}
          data={pulverizacion}
          cultivos={cultivos}
          pulverizaciones={pulverizaciones}
        />
      )}
      placeholder={<LocationsMasonrySkeleton />}
    />
  );
};
