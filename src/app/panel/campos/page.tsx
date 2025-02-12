import { AddOrEditCampoDialog } from '@/components/campos-dialog';
import CamposContainer from '@/components/campos-container';
import Finder from '@/components/finder';
import { Suspense } from 'react';

interface Props {
  searchParams: Promise<{
    nombre: string;
  }>;
}

export default async function Campos({ searchParams }: Props) {
  const { nombre } = await searchParams;

  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>Administra las ubicaciones en los que se realizan los trabajos.</h2>
      <aside id='finder' className='flex items-center justify-between gap-4'>
        <Finder />
        <AddOrEditCampoDialog />
      </aside>
      <Suspense>
        <CamposContainer query={nombre} />
      </Suspense>
    </main>
  );
}
