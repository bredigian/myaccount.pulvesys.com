'use client';

import {
  AddOrEditProductoDialog,
  DeleteProductoDialog,
} from './productos-dialog';
import { Card, CardContent } from './ui/card';
import { Producto, UNIDAD } from '@/types/productos.types';

import { Badge } from './ui/badge';
import { UUID } from 'crypto';

interface Props {
  data: Producto;
}

export default function ProductoItem({ data }: Props) {
  const parsedUnidad = data.unidad
    .charAt(0)
    .concat(data.unidad.substring(1).toLowerCase());

  return (
    <li className='flex items-start justify-between'>
      <Card className='hover:bg-sidebar-accent w-full duration-200 ease-in-out'>
        <CardContent className='flex items-start justify-between pt-6'>
          <div className='space-y-1'>
            <h3 className='text-base font-semibold'>{data.nombre}</h3>
            <div className='flex items-center gap-2'>
              <p className='text-sm text-muted-foreground'>
                20
                {data.unidad === UNIDAD.GRAMOS.toUpperCase()
                  ? data.unidad.charAt(0).toLowerCase()
                  : data.unidad.charAt(0)}{' '}
              </p>
              <Badge variant='secondary'>{parsedUnidad}</Badge>
            </div>
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
