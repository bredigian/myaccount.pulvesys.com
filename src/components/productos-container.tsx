import ProductoItem from './producto-item';
import { getProductos } from '@/services/productos.service';

interface Props {
  query: string;
}

export default async function ProductosContainer({ query }: Props) {
  const data = await getProductos();
  if (data instanceof Error) return <p>{data?.message}</p>;

  const filteredData = !query
    ? data
    : data.filter((item) =>
        item.nombre.toLowerCase().includes(query.toLowerCase()),
      );

  return (
    <ul className='space-y-4'>
      {filteredData.length > 0 ? (
        filteredData.map((producto) => (
          <ProductoItem key={producto.id} data={producto} />
        ))
      ) : (
        <li className='pt-4 text-center opacity-75'>
          No se encontraron productos
        </li>
      )}
    </ul>
  );
}
