import { RedirectType, redirect } from 'next/navigation';

import { DateTime } from 'luxon';
import { PulverizacionesGridContainer } from './masonry-container';
import { cookies } from 'next/headers';
import { getPulverizaciones } from '@/services/pulverizaciones.service';

interface Props {
  query: string;
}

export const PulverizacionesContainer = async ({ query }: Props) => {
  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');
  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  const data = await getPulverizaciones(access_token.value, refresh_token);
  if ('error' in data) return <p>{data?.message}</p>;

  if (data.length === 0)
    return <p>No has registrado ninguna pulverización aún.</p>;

  const filteredData = !query
    ? data
    : data.filter(
        (p) =>
          p.detalle.campo?.nombre.toLowerCase().includes(query.toLowerCase()) ||
          DateTime.fromISO(p.fecha as string)
            .toFormat('dd/MM/yyyy')
            ?.includes(query) ||
          DateTime.fromISO(p.fecha as string)
            .setLocale('es-AR')
            .monthLong?.toLowerCase()
            ?.includes(query.toLowerCase()),
      );

  return filteredData.length > 0 ? (
    <PulverizacionesGridContainer data={filteredData} />
  ) : (
    <ul>
      <li>
        No se encontraron resultados para{' '}
        <span className='font-semibold italic'>{query}</span>
      </li>
    </ul>
  );
};
