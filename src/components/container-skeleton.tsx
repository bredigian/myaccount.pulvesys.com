import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  CultivoTratamientoItemSkeleton,
  HistorialItemSkeleton,
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

export const SuscripcionContainerSkeleton = () => {
  return (
    <Card className='md:max-w-lg'>
      <CardHeader>
        <CardTitle className='flex items-start justify-between gap-4'>
          <Skeleton className='h-4 w-full max-w-48 lg:h-5' />
          <Skeleton className='h-6 w-24 lg:h-7' />
        </CardTitle>
        <CardDescription>
          <ul className='flex flex-col gap-2'>
            <li>
              <Skeleton className='h-3 w-24' />
            </li>
            <li>
              <Skeleton className='h-3 w-24' />
            </li>
            <li>
              <Skeleton className='h-3 w-24' />
            </li>
          </ul>
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <Skeleton className='h-4 w-44 lg:h-6' />
        <Skeleton className='h-3 w-56 lg:h-4' />
      </CardContent>
      <CardFooter className='flex flex-col items-start gap-2'>
        <Skeleton className='h-3 w-56' />
        <Skeleton className='h-3 w-56' />
      </CardFooter>
    </Card>
  );
};

export const HistorialContainerSkeleton = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 20 }, (_, i) => (
          <HistorialItemSkeleton key={`historial-item-skeleton-${i}`} />
        ))}
      </TableBody>
    </Table>
  );
};
