import { Card, CardContent } from './ui/card';
import { PackageOpen, PackageXIcon } from 'lucide-react';

import { Button } from './ui/button';
import { getProductos } from '@/services/productos.service';

export default async function ProductosContainer() {
  const data = await getProductos();
  if (data instanceof Error) return <p>{data?.message}</p>;

  return (
    <Card className=''>
      <CardContent className='pt-6'>
        <ul className='space-y-4'>
          {data.map((producto) => (
            <li key={producto.id} className='flex items-center justify-between'>
              <div className='space-y-2'>
                <span className='text-base'>{producto.nombre}</span>
                <p className='text-sm'>
                  {producto.cantidad} {producto.unidad}
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
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
