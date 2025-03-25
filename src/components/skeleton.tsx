import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TableCell, TableRow } from './ui/table';

import { Skeleton } from './ui/skeleton';

export const PulverizacionItemSkeleton = () => {
  return (
    <li className='col-span-full flex items-start justify-between md:col-span-3 xl:col-span-2'>
      <Card className='size-full duration-200 ease-in-out hover:bg-secondary'>
        <CardHeader>
          <CardTitle className='flex items-start justify-between gap-4'>
            <Skeleton className='h-4 w-full max-w-48' />
            <Skeleton className='h-3 w-32' />
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <ul className='flex flex-wrap items-start gap-2 overflow-hidden'>
            {Array.from({ length: 2 }, (_, i) => (
              <LoteItemSkeleton key={`lote-skeleton-${i}`} />
            ))}
          </ul>
          <div className='flex flex-wrap gap-2'>
            <Skeleton className='h-3 w-28' />
            <Skeleton className='h-3 w-28' />
          </div>
          <ul className='flex flex-wrap items-center gap-2'>
            <Skeleton className='h-3 w-24' />
            <Skeleton className='h-3 w-24' />
            <Skeleton className='h-3 w-24' />
          </ul>
        </CardContent>
      </Card>
    </li>
  );
};

export const CampoItemSkeleton = () => {
  return (
    <li className='col-span-full flex items-start justify-between md:col-span-3 xl:col-span-2'>
      <Card className='size-full'>
        <CardHeader>
          <CardTitle className='flex items-start justify-between gap-4'>
            <Skeleton className='h-4 w-full max-w-48' />
            <div className='flex items-center gap-2'>
              <Skeleton className='size-8' />
              <Skeleton className='size-8' />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-3 w-12' />
          <Skeleton className='h-48 w-full' />
          <ul className='flex flex-wrap items-start gap-2 overflow-hidden'>
            {Array.from({ length: 3 }, (_, i) => (
              <LoteItemSkeleton key={`lote-skeleton-${i}`} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </li>
  );
};

export const LoteItemSkeleton = () => {
  return <Skeleton className='h-6 w-20' />;
};

export const ProductoItemSkeleton = () => {
  return (
    <TableRow className='h-12'>
      <TableCell>
        <Skeleton className='h-3 w-full max-w-24' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-5 w-20' />
      </TableCell>
      <TableCell align='right'>
        <Skeleton className='h-3 w-8' />
      </TableCell>
    </TableRow>
  );
};

export const CultivoTratamientoItemSkeleton = () => {
  return (
    <TableRow className='h-12'>
      <TableCell>
        <Skeleton className='h-3 w-full max-w-24' />
      </TableCell>
      <TableCell align='right'>
        <Skeleton className='h-3 w-8' />
      </TableCell>
    </TableRow>
  );
};

export const UsuarioItemSkeleton = () => {
  return (
    <TableRow className='h-12'>
      <TableCell>
        <Skeleton className='h-3 w-full max-w-14' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-3 w-full max-w-14' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-3 w-full max-w-24' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-3 w-full max-w-20' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-3 w-full max-w-20' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-3 w-full max-w-48' />
      </TableCell>
      <TableCell align='right'>
        <Skeleton className='h-3 w-full max-w-3' />
      </TableCell>
    </TableRow>
  );
};
