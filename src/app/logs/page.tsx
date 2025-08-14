import Finder from '@/components/finder';
import LogsContainer from '@/components/logs-container';
import { LogsContainerSkeleton } from '@/components/container-skeleton';
import { Suspense } from 'react';
import { normalize } from '@/lib/utils';

interface Props {
  searchParams: Promise<{ filter: string }>;
}

export default async function LogsPage({ searchParams }: Props) {
  const { filter } = await searchParams;

  return (
    <main className='space-y-4 p-4 pt-0'>
      <aside
        id='finder'
        className='flex w-full items-center justify-between gap-4'
      >
        <Finder param='filter' placeholder='Buscar' />
      </aside>
      <Suspense fallback={<LogsContainerSkeleton />} key={filter}>
        <LogsContainer filter={normalize(filter ?? '')} />
      </Suspense>
    </main>
  );
}
