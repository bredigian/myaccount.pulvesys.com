import { RedirectType, redirect } from 'next/navigation';

import { DateTime } from 'luxon';
import SpraysContainerEmpty from './sprays-container-empty';
import { SpraysGridContainer } from './masonry-container';
import { cookies } from 'next/headers';
import { getSprays } from '@/services/sprays.service';

interface Props {
  query: string;
}

export default async function SpraysContainer({ query }: Props) {
  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');
  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  const data = await getSprays(access_token.value, refresh_token);
  if ('error' in data) return <p>{data?.message}</p>;

  if (data.length === 0) return <SpraysContainerEmpty />;

  const filteredData = !query
    ? data
    : data.filter(
        (p) =>
          p.id?.toLowerCase().includes(query.toLowerCase()) ||
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
    <SpraysGridContainer data={filteredData} />
  ) : (
    <ul>
      <li>
        No se encontraron resultados para{' '}
        <span className='font-semibold italic'>{query}</span>
      </li>
    </ul>
  );
}
