import { RedirectType, redirect } from 'next/navigation';

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
  if (!access_token) redirect('/', RedirectType.replace);

  const data = await getById(id, access_token.value);

  if ('error' in data) return <p className='px-4'>{data.message}</p>;

  return <PulverizacionDetailContainer data={data} />;
}
