'use client';

import {
  AddOrEditProductoDialog,
  DeleteProductoDialog,
} from './productos-dialog';
import { Card, CardContent } from './ui/card';

import { Badge } from './ui/badge';
import { Producto } from '@/types/productos.types';
import { UUID } from 'crypto';

interface Props {
  data: Producto;
}

export default function ProductoItem({ data }: Props) {
  const parsedUnidad = data.unidad
    .charAt(0)
    .concat(data.unidad.substring(1).toLowerCase());

  return (
    <li className='col-span-full flex items-start justify-between sm:col-span-2 xl:col-span-2'>
      <Card className='w-full duration-200 ease-in-out hover:bg-sidebar-accent'>
        <CardContent className='flex items-start justify-between gap-4 pt-6'>
          <div className='space-y-1 truncate'>
            <h3 className='truncate text-base font-semibold'>{data.nombre}</h3>
            <div className='flex items-center gap-2'>
              <Badge variant='secondary'>
                {data.cantidad} {parsedUnidad}
              </Badge>
            </div>
          </div>
          <aside className='producto-settings flex items-center gap-2'>
            <AddOrEditProductoDialog isEdit data={data} />
            <DeleteProductoDialog id={data.id as UUID} />
          </aside>
        </CardContent>
      </Card>
    </li>
  );
}
