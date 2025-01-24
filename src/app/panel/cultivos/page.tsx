import { AddOrEditCultivoDialog } from '@/components/cultivos-dialog';
import CultivosContainer from '@/components/cultivos-container';
import Finder from '@/components/finder';
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
        Administra los cultivos que habitualmente se utilizan en las
        pulverizaciones.
      </h2>
      <aside id='finder' className='flex items-center gap-4'>
        <Finder />
        <AddOrEditCultivoDialog />
      </aside>
      <Suspense>
        <CultivosContainer query={nombre} />
      </Suspense>
    </main>
  );
}
