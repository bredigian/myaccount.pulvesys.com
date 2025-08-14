import CropsTreatmentsContainer from '@/components/crops&treatments-container';
import { CropsTreatmentsContainerSkeleton } from '@/components/container-skeleton';
import { Suspense } from 'react';

interface Props {
  searchParams: Promise<{
    nombre: string;
  }>;
}

export default async function CropsPage({ searchParams }: Props) {
  const { nombre } = await searchParams;

  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>
        Administra los cultivos y tratamientos que se utilizan en las
        pulverizaciones.
      </h2>
      <Suspense fallback={<CropsTreatmentsContainerSkeleton />}>
        <CropsTreatmentsContainer nombre={nombre || ''} />
      </Suspense>
    </main>
  );
}
