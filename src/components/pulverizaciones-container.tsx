import { RedirectType, redirect } from 'next/navigation';

import { cookies } from 'next/headers';
import { getPulverizaciones } from '@/services/pulverizaciones.service';
import PulverizacionesGridContainer from './pulverizaciones-grid-container';
import { DateTime } from 'luxon';

interface Props {
  query: string;
}

export const PulverizacionesContainer = async ({ query }: Props) => {
  const access_token = (await cookies()).get('access_token');
  if (!access_token) redirect('/', RedirectType.replace);

  const data = await getPulverizaciones(access_token.value);
  if (data instanceof Error) return <p>{data?.message}</p>;

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

  return <PulverizacionesGridContainer data={filteredData} />;
};
