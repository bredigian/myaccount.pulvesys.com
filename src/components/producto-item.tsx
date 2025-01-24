import { PackageOpen, PackageXIcon } from 'lucide-react';

import { Button } from './ui/button';
import { Producto } from '@/types/productos.types';

interface Props {
  data: Producto;
}

export default function ProductoItem({ data }: Props) {
  return (
    <li className='flex items-center justify-between'>
      <div className='space-y-2'>
        <span className='text-base'>{data.nombre}</span>
        <p className='text-sm'>
          {data.cantidad} {data.unidad}
        </p>
      </div>
      <aside className='producto-settings space-x-4'>
        <Button size={'icon'} variant={'outline'}>
          <PackageOpen />
        </Button>
        <Button size={'icon'} variant={'destructive'}>
          <PackageXIcon />
        </Button>
      </aside>
    </li>
  );
}
