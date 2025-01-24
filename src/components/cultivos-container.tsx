import CultivoItem from './cultivo-item';
import { getCultivos } from '@/services/cultivos.service';

interface Props {
  query: string;
}

export default async function CultivosContainer({ query }: Props) {
  const data = await getCultivos();
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
          <CultivoItem key={producto.id} data={producto} />
        ))
      ) : (
        <li className='pt-4 text-center opacity-75'>
          No se encontraron cultivos
        </li>
      )}
    </ul>
  );
}
