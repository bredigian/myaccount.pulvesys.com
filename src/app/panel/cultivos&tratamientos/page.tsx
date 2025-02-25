import { CultivosTratamientosContainerSkeleton } from '@/components/container-skeleton';
import CultivosTratamientosContainer from '@/components/cultivos&tratamientos-container';
import { Suspense } from 'react';

interface Props {
  searchParams: Promise<{
    nombre: string;
  }>;
}

export default async function Cultivos({ searchParams }: Props) {
  const { nombre } = await searchParams;

  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>
        Administra los cultivos y tratamientos que se utilizan en las
        pulverizaciones.
      </h2>
      <Suspense fallback={<CultivosTratamientosContainerSkeleton />}>
        <CultivosTratamientosContainer nombre={nombre || ''} />
      </Suspense>
    </main>
  );
}
