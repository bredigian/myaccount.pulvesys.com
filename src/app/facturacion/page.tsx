import FacturacionContainer from '@/components/facturacion-container';
import { ManageFacturacionDropdown } from '@/components/facturacion-dropdown';
import { SuscripcionContainerSkeleton } from '@/components/container-skeleton';
import { Suspense } from 'react';

export default async function Facturacion() {
  return (
    <main className='space-y-4 p-4 pt-0'>
      <ManageFacturacionDropdown />
      <Suspense fallback={<SuscripcionContainerSkeleton />}>
        <FacturacionContainer />
      </Suspense>
    </main>
  );
}
