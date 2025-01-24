import { Card, CardContent } from './ui/card';

import ProductoItem from './producto-item';
import { getProductos } from '@/services/productos.service';

export default async function ProductosContainer() {
  const data = await getProductos();
  if (data instanceof Error) return <p>{data?.message}</p>;

  return (
    <Card className=''>
      <CardContent className='pt-6'>
        <ul className='space-y-4'>
          {data.map((producto) => (
            <ProductoItem key={producto.id} data={producto} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
