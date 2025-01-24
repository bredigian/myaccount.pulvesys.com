import { AddOrEditProductoDialog } from '@/components/productos-dialog';
import { Input } from '@/components/ui/input';
import ProductosContainer from '@/components/productos-container';
import { Search } from 'lucide-react';
import { Suspense } from 'react';

export default function Productos() {
  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>Administra los productos disponibles para las pulverizaciones.</h2>
      <aside id='finder' className='flex items-center gap-4'>
        <div className='relative flex items-center'>
          <Search className='absolute pl-2 opacity-50' />
          <Input placeholder='Buscar' className='pl-7' />
        </div>
        <AddOrEditProductoDialog />
      </aside>
      <Suspense>
        <ProductosContainer />
      </Suspense>
    </main>
  );
}
