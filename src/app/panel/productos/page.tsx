import { AddOrEditProductoDialog } from '@/components/productos-dialog';
import Finder from '@/components/finder';
import ProductosContainer from '@/components/productos-container';
import { Suspense } from 'react';
import { ProductosContainerSkeleton } from '@/components/container-skeleton';

interface Props {
  searchParams: Promise<{
    nombre: string;
  }>;
}

export default async function Productos({ searchParams }: Props) {
  const { nombre } = await searchParams;

  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>Administra los productos disponibles para las pulverizaciones.</h2>
      <aside id='finder' className='flex items-center justify-between gap-4'>
        <Finder />
        <AddOrEditProductoDialog />
      </aside>
      <Suspense fallback={<ProductosContainerSkeleton />}>
        <ProductosContainer query={nombre} />
      </Suspense>
    </main>
  );
}
