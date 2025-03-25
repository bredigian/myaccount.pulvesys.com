import {
  CultivoTratamientoItemSkeleton,
  ProductoItemSkeleton,
  UsuarioItemSkeleton,
} from './skeleton';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './ui/table';

import { Skeleton } from './ui/skeleton';

export const ProductosContainerSkeleton = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Unidad</TableHead>
          <TableHead className='text-end'>Opciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 20 }, (_, i) => (
          <ProductoItemSkeleton key={`producto-item-skeleton-${i}`} />
        ))}
      </TableBody>
    </Table>
  );
};

export const UsuariosContainerSkeleton = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Apellido</TableHead>
          <TableHead>Correo electrónico</TableHead>
          <TableHead>Nombre de usuario</TableHead>
          <TableHead>Nro. de teléfono</TableHead>
          <TableHead>ID</TableHead>
          <TableHead className='text-end'>Opciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 20 }, (_, i) => (
          <UsuarioItemSkeleton key={`usuario-item-skeleton-${i}`} />
        ))}
      </TableBody>
    </Table>
  );
};

export const CultivosTratamientosContainerSkeleton = () => {
  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='w-full space-y-2'>
        <div className='flex w-full justify-between gap-4'>
          <Skeleton className='h-8 w-52' />
          <Skeleton className='h-8 w-24' />
        </div>
        <Skeleton className='h-7 w-full' />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className='text-end'>Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 20 }, (_, i) => (
            <CultivoTratamientoItemSkeleton
              key={`cultivo&tratamiento-item-skeleton-${i}`}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
