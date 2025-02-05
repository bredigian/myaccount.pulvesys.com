import { RedirectType, redirect } from 'next/navigation';

import PulverizacionItem from './pulverizacion-item';
import { cookies } from 'next/headers';
import { getPulverizaciones } from '@/services/pulverizaciones.service';

export const PulverizacionesContainer = async () => {
  const access_token = (await cookies()).get('access_token');
  if (!access_token) redirect('/', RedirectType.replace);

  const data = await getPulverizaciones(access_token.value);
  if (data instanceof Error) return <p>{data?.message}</p>;

  return (
    <ul className='grid w-full grid-cols-4 gap-4 lg:grid-cols-6 xl:grid-cols-8'>
      {data.length > 0 ? (
        data.map((pulverizacion) => (
          <PulverizacionItem
            key={pulverizacion.id}
            pulverizacion={pulverizacion}
          />
        ))
      ) : (
        <li className='col-span-full pt-4 text-center opacity-75 md:pt-0 md:text-start'>
          No se encontraron pulverizaciones
        </li>
      )}
    </ul>
  );
};
