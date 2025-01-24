'use client';

import {
  AddOrEditProductoDialog,
  DeleteProductoDialog,
} from './productos-dialog';
import { Card, CardContent } from './ui/card';

import { Producto } from '@/types/productos.types';
import { UUID } from 'crypto';

interface Props {
  data: Producto;
}

export default function ProductoItem({ data }: Props) {
  return (
    <li className='flex items-center justify-between'>
      <Card className='hover:bg-sidebar-accent w-full duration-200 ease-in-out'>
        <CardContent className='flex items-center justify-between pt-6'>
          <div className='space-y-2'>
            <span className='text-base'>{data.nombre}</span>
            <p className='text-sm'>
              {data.cantidad} {data.unidad}
            </p>
          </div>
          <aside className='producto-settings space-x-4'>
            <AddOrEditProductoDialog isEdit data={data} />
            <DeleteProductoDialog id={data.id as UUID} />
          </aside>
        </CardContent>
      </Card>
    </li>
  );
}
