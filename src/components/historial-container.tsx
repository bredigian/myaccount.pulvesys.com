import { RedirectType, redirect } from 'next/navigation';

import HistorialTable from './historial-table';
import { cookies } from 'next/headers';
import { getHistorial } from '@/services/historial.service';

interface Props {
  filter: string;
}

export default async function HistorialContainer({ filter }: Props) {
  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');
  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  const data = await getHistorial(access_token.value, refresh_token);
  if ('error' in data) return <p>{data?.message}</p>;

  const filteredData = !filter
    ? data
    : data.filter(
        (item) =>
          item?.type.toLowerCase().includes(filter.toLowerCase()) ||
          item?.usuario?.nombre
            ?.concat(item?.usuario?.apellido as string)
            .toLowerCase()
            .includes(filter.replaceAll(' ', '').toLowerCase()),
      );

  return <HistorialTable data={filteredData} />;
}
