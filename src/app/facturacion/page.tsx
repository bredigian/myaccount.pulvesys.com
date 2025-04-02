import FacturacionContainer from '@/components/facturacion-container';
import { ManageFacturacionDialog } from '@/components/facturacion-dialog';
import { Suspense } from 'react';

export default async function Facturacion() {
  return (
    <main className='space-y-4 p-4 pt-0'>
      <aside className='flex items-start justify-between gap-4'>
        <h2>Visualizá y administrá tu suscripción a PulveSys.</h2>
        <ManageFacturacionDialog />
      </aside>
      <Suspense fallback={<>Loading...</>}>
        <FacturacionContainer />
      </Suspense>
    </main>
  );
}
