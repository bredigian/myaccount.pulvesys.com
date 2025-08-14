import { AddOrEditUserDialog } from '@/components/users-dialog';
import Finder from '@/components/finder';
import { MAX_USERS } from '@/data/max_users';
import { Suspense } from 'react';
import { UsersContainerSkeleton } from '@/components/container-skeleton';
import UsuariosContainer from '@/components/users-container';

interface Props {
  searchParams: Promise<{ filter: string }>;
}

export default async function UsersEnterprisePage({ searchParams }: Props) {
  const { filter } = await searchParams;

  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>
        Creá, modificá y eliminá los usuarios correspondientes a tus empleados.
        Recordá que podés crear <strong>hasta {MAX_USERS} usuarios</strong>.
      </h2>
      <aside id='finder' className='flex items-center justify-between gap-4'>
        <Finder param='filter' placeholder='Buscar' />
        <AddOrEditUserDialog />
      </aside>
      <Suspense fallback={<UsersContainerSkeleton />}>
        <UsuariosContainer filter={filter} />
      </Suspense>
    </main>
  );
}
