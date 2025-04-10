import HistorialContainer from '@/components/historial-container';
import { HistorialContainerSkeleton } from '@/components/container-skeleton';
import { Suspense } from 'react';

interface Props {
  searchParams: Promise<{ filter: string }>;
}

export default async function Historial({ searchParams }: Props) {
  const { filter } = await searchParams;

  return (
    <main className='space-y-4 p-4 pt-0'>
      <Suspense fallback={<HistorialContainerSkeleton />}>
        <HistorialContainer filter={filter} />
      </Suspense>
    </main>
  );
}
