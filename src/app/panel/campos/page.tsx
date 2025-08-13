import AddCampoContainer from '@/components/add-campo-container';
import { Button } from '@/components/ui/button';
import CamposContainer from '@/components/campos-container';
import { CamposMasonrySkeleton } from '@/components/masonry-skeleton';
import Finder from '@/components/finder';
import { ReloadIcon } from '@radix-ui/react-icons';
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
        <Suspense
          fallback={
            <Button disabled size={'icon'}>
              <ReloadIcon className='animate-spin' />
            </Button>
          }
        >
          <AddCampoContainer />
        </Suspense>
      </aside>
      <p className='text-sm opacity-75'>
        Tené en cuenta que el color del lote en los diferentes campos está
        relacionado al cultivo utilizado el la última órden de pulverización
        generada para el campo en particular.
      </p>
      <Suspense fallback={<CamposMasonrySkeleton />}>
        <CamposContainer query={nombre} />
      </Suspense>
    </main>
  );
}
