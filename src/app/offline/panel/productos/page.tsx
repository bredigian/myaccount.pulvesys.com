'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';

import { AddOrEditProductoDialog } from '@/components/productos-dialog';
import { Producto } from '@/types/productos.types';
import ProductoItem from '@/components/producto-item';
import { ProductosContainerSkeleton } from '@/components/container-skeleton';
import { STATE } from '@/types/root.types';

function ProductosContainerLoader() {
  const [state, setState] = useState<STATE>('pending');
  const [data, setData] = useState<Producto[]>();

  useEffect(() => {
    const fetchData = async () => {
      setState('processing');

      const cache = await caches.open('api-cache');
      const data = await (await cache.match('/api/productos'))?.json();
      setData(data);

      setState('success');
    };

    fetchData();
  }, []);

  return state !== 'success' ? (
    <ProductosContainerSkeleton />
  ) : (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Unidad</TableHead>
          <TableHead className='text-end'>Opciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data!.length === 0 ? (
          <TableRow className='h-12'>
            <TableCell>No se encontraron productos</TableCell>
          </TableRow>
        ) : (
          data!.map((producto, index) => (
            <ProductoItem
              key={producto.id ?? `producto__cached-${index}`}
              producto={producto}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default function OfflineProductos() {
  return (
    <main className='space-y-4 p-4 pt-0'>
      <h2>Administra los productos disponibles para las pulverizaciones.</h2>
      <aside id='finder' className='flex items-center justify-between gap-4'>
        {/* <Finder /> */}
        <AddOrEditProductoDialog />
      </aside>
      <ProductosContainerLoader />
    </main>
  );
}
