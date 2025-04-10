import { AddOrEditUsuarioDialog } from '@/components/usuarios-dialog';
import Finder from '@/components/finder';
import { MAX_USERS } from '@/data/max_users';
import { Suspense } from 'react';
import UsuariosContainer from '@/components/usuarios-container';
import { UsuariosContainerSkeleton } from '@/components/container-skeleton';

interface Props {
  searchParams: Promise<{ filter: string }>;
}

export default async function PanelUsuariosEmpresa({ searchParams }: Props) {
  const { filter } = await searchParams;

  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>
        Creá, modificá y eliminá los usuarios correspondientes a tus empleados.
        Recordá que podés crear <strong>hasta {MAX_USERS} usuarios</strong>.
      </h2>
      <aside id='finder' className='flex items-center justify-between gap-4'>
        <Finder param='filter' placeholder='Buscar' />
        <AddOrEditUsuarioDialog />
      </aside>
      <Suspense fallback={<UsuariosContainerSkeleton />}>
        <UsuariosContainer filter={filter} />
      </Suspense>
    </main>
  );
}
