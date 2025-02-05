import { RedirectType, redirect } from 'next/navigation';

import ProductoItem from './producto-item';
import { cookies } from 'next/headers';
import { getProductos } from '@/services/productos.service';

interface Props {
  query: string;
}

export default async function ProductosContainer({ query }: Props) {
  const access_token = (await cookies()).get('access_token');
  if (!access_token) redirect('/', RedirectType.replace);

  const data = await getProductos(access_token.value);
  if (data instanceof Error) return <p>{data?.message}</p>;

  const filteredData = !query
    ? data
    : data.filter((item) =>
        item.nombre.toLowerCase().includes(query.toLowerCase()),
      );

  return (
    <ul className='grid w-full gap-4 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10'>
      {filteredData.length > 0 ? (
        filteredData.map((producto) => (
          <ProductoItem key={producto.id} data={producto} />
        ))
      ) : (
        <li className='col-span-full pt-4 text-center opacity-75 md:pt-0 md:text-start'>
          No se encontraron productos
        </li>
      )}
    </ul>
  );
}
