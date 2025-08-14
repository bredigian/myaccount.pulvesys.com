import { RedirectType, redirect } from 'next/navigation';

import { LocationsGridContainer } from './masonry-container';
import { cookies } from 'next/headers';
import { getCrops } from '@/services/crops.service';
import { getLocations } from '@/services/locations.service';
import { getSprays } from '@/services/sprays.service';

interface Props {
  query: string;
}

export async function LocationsContainer({ query }: Props) {
  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');
  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  const data = await getLocations(access_token.value, refresh_token);
  const cultivos = await getCrops(access_token.value, refresh_token);
  const pulverizaciones = await getSprays(access_token.value, refresh_token);
  if ('error' in data || 'error' in cultivos || 'error' in pulverizaciones)
    return <p>Se produjo un error al obtener los datos</p>;

  if (data.length === 0) return <p>No has registrado ninguna ubicación aún.</p>;

  const filteredData = !query
    ? data
    : data.filter((item) =>
        item.nombre.toLowerCase().includes(query.toLowerCase()),
      );

  return filteredData.length > 0 ? (
    <LocationsGridContainer
      data={filteredData}
      cultivos={cultivos}
      pulverizaciones={pulverizaciones}
    />
  ) : (
    <ul>
      <li>
        No se encontraron resultados para{' '}
        <span className='font-semibold italic'>{query}</span>
      </li>
    </ul>
  );
}
