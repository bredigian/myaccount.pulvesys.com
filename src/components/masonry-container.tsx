'use client';

import {
  CamposMasonrySkeleton,
  PulverizacionesMasonrySkeleton,
} from './masonry-skeleton';

import { Campo } from '@/types/campos.types';
import CampoItem from './campo-item';
import { Cultivo } from '@/types/cultivos.types';
import { Masonry } from './masonry';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import PulverizacionItem from './pulverizacion-item';

export const PulverizacionesGridContainer = ({
  data,
}: {
  data: Pulverizacion[];
}) => {
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
      placeholder={<PulverizacionesMasonrySkeleton />}
    />
  );
};

export const CamposGridContainer = ({
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
        <CampoItem
          key={pulverizacion.id}
          data={pulverizacion}
          cultivos={cultivos}
          pulverizaciones={pulverizaciones}
        />
      )}
      placeholder={<CamposMasonrySkeleton />}
    />
  );
};
