import AddLocationContainer from '@/components/add-location-container';
import { Button } from '@/components/ui/button';
import Finder from '@/components/finder';
import { LocationsContainer } from '@/components/locations-container';
import { LocationsMasonrySkeleton } from '@/components/masonry-skeleton';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Suspense } from 'react';

interface Props {
  searchParams: Promise<{
    nombre: string;
  }>;
}

export default async function LocationsPage({ searchParams }: Props) {
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
          <AddLocationContainer />
        </Suspense>
      </aside>
      <p className='text-sm opacity-75'>
        Tené en cuenta que el color del lote en los diferentes campos está
        relacionado al cultivo utilizado en la última órden de pulverización
        generada para ese campo en particular.
      </p>
      <Suspense fallback={<LocationsMasonrySkeleton />} key={nombre}>
        <LocationsContainer query={nombre} />
      </Suspense>
    </main>
  );
}
