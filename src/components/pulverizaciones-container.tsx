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
    <ul className='space-y-4'>
      {data.map((pulverizacion) => (
        <PulverizacionItem
          key={pulverizacion.id}
          pulverizacion={pulverizacion}
        />
      ))}
    </ul>
  );
};
