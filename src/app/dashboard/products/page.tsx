import { AddOrEditProductDialog } from '@/components/products-dialog';
import Finder from '@/components/finder';
import ProductsContainer from '@/components/products-container';
import { ProductsContainerSkeleton } from '@/components/container-skeleton';
import { Suspense } from 'react';

interface Props {
  searchParams: Promise<{
    nombre: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { nombre } = await searchParams;

  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>Administra los productos disponibles para las pulverizaciones.</h2>
      <aside id='finder' className='flex items-center justify-between gap-4'>
        <Finder />
        <AddOrEditProductDialog />
      </aside>
      <Suspense fallback={<ProductsContainerSkeleton />}>
        <ProductsContainer query={nombre} />
      </Suspense>
    </main>
  );
}
