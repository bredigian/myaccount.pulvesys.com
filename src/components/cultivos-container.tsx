import { RedirectType, redirect } from 'next/navigation';

import CultivoItem from './cultivo-item';
import { cookies } from 'next/headers';
import { getCultivos } from '@/services/cultivos.service';

interface Props {
  query: string;
}

export default async function CultivosContainer({ query }: Props) {
  const access_token = (await cookies()).get('access_token');
  if (!access_token) redirect('/', RedirectType.replace);

  const data = await getCultivos(access_token.value);
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
