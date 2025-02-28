import { RedirectType, redirect } from 'next/navigation';

import { Pulverizacion } from '@/types/pulverizaciones.types';
import PulverizacionDetailContainer from '@/components/pulverizacion-detail-container';
import { UUID } from 'crypto';
import { cookies } from 'next/headers';
import { getById } from '@/services/pulverizaciones.service';

type Params = Promise<{ id: UUID }>;

interface Props {
  searchParams: Params;
}

export default async function PulverizacionDetail({ searchParams }: Props) {
  const { id } = await searchParams;
  if (!id) redirect('/panel', RedirectType.replace);

  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');
  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  const data: Pulverizacion | Error = await getById(
    id,
    access_token.value,
    refresh_token,
  );

  if (data instanceof Error) return <p className='px-4'>{data.message}</p>;

  return <PulverizacionDetailContainer data={data} />;
}
