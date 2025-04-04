import FacturacionContainer from '@/components/facturacion-container';
import { ManageFacturacionDropdown } from '@/components/facturacion-dropdown';
import { Suspense } from 'react';

export default async function Facturacion() {
  return (
    <main className='space-y-4 p-4 pt-0'>
      <aside className='flex items-start justify-between gap-4'>
        <h2>Visualizá y administrá tu suscripción a PulveSys.</h2>
        <ManageFacturacionDropdown />
      </aside>
      <Suspense fallback={<>Loading...</>}>
        <FacturacionContainer />
      </Suspense>
    </main>
  );
}
