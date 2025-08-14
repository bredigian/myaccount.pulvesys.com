import { RedirectType, redirect } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

import ProductItem from './product-item';
import { cookies } from 'next/headers';
import { getProducts } from '@/services/products.service';

interface Props {
  query: string;
}

export default async function ProductsContainer({ query }: Props) {
  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');
  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  const data = await getProducts(access_token.value, refresh_token);
  if ('error' in data) return <p>{data?.message}</p>;

  const filteredData = !query
    ? data
    : data.filter((item) =>
        item.nombre.toLowerCase().includes(query.toLowerCase()),
      );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Unidad</TableHead>
          <TableHead className='text-end'>Opciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.length === 0 ? (
          <TableRow className='h-12'>
            <TableCell>No se encontraron productos</TableCell>
          </TableRow>
        ) : (
          filteredData.map((producto) => (
            <ProductItem key={producto.id} producto={producto} />
          ))
        )}
      </TableBody>
    </Table>
  );
}
