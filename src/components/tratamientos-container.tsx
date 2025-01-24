import TratamientoItem from './tratamiento-item';
import { getTratamientos } from '@/services/tratamientos.service';

interface Props {
  query: string;
}

export default async function TratamientosContainer({ query }: Props) {
  const data = await getTratamientos();
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
          <TratamientoItem key={producto.id} data={producto} />
        ))
      ) : (
        <li className='pt-4 text-center opacity-75'>
          No se encontraron productos
        </li>
      )}
    </ul>
  );
}
