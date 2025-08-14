'use client';

import {
  LocationsMasonrySkeleton,
  SpraysMasonrySkeleton,
} from './masonry-skeleton';

import { Crop } from '@/types/crops.types';
import { Location } from '@/types/locations.types';
import LocationItem from './location-item';
import { Masonry } from './masonry';
import { Spray } from '@/types/sprays.types';
import SprayItem from './spray-item';

export const SpraysGridContainer = ({ data }: { data: Spray[] }) => {
  return (
    <Masonry
      items={data}
      config={{
        columns: [1, 2, 3, 4, 5],
        gap: [16, 16, 16, 16, 16],
        media: [768, 1024, 1280, 1400, 1536],
      }}
      render={(pulverizacion) => (
        <SprayItem key={pulverizacion.id} pulverizacion={pulverizacion} />
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
  data: Location[];
  cultivos: Crop[];
  pulverizaciones: Spray[];
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
