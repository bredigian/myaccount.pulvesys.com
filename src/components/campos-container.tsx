import { RedirectType, redirect } from 'next/navigation';

import CampoItem from './campo-item';
import { cookies } from 'next/headers';
import { getCampos } from '@/services/campos.service';

interface Props {
  query: string;
}

export default async function CamposContainer({ query }: Props) {
  const access_token = (await cookies()).get('access_token');
  if (!access_token) redirect('/', RedirectType.replace);

  const data = await getCampos(access_token.value);
  if (data instanceof Error) return <p>{data?.message}</p>;

  const filteredData = !query
    ? data
    : data.filter((item) =>
        item.nombre.toLowerCase().includes(query.toLowerCase()),
      );

  return (
    <ul className='grid w-full gap-4 sm:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8'>
      {filteredData.length > 0 ? (
        filteredData.map((campo) => <CampoItem key={campo.id} data={campo} />)
      ) : (
        <li className='col-span-full pt-4 text-center opacity-75 md:pt-0 md:text-start'>
          No se encontraron ubicaciones
        </li>
      )}
    </ul>
  );
}
