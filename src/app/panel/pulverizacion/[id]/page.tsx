import { RedirectType, redirect } from 'next/navigation';
import {
  getById,
  getPulverizaciones,
} from '@/services/pulverizaciones.service';

import { APIError } from '@/types/error.types';
import PulverizacionDetailContainer from '@/components/pulverizacion-detail-container';
import { UUID } from 'crypto';
import { cookies } from 'next/headers';

type Params = Promise<{ id: UUID }>;

interface Props {
  params: Params;
}

export default async function PulverizacionDetail({ params }: Props) {
  const { id } = await params;
  if (!id) redirect('/panel', RedirectType.replace);

  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');
  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  const data = await getById(id, access_token.value, refresh_token);
  const pulverizaciones = await getPulverizaciones(
    access_token.value,
    refresh_token,
  );

  if ('error' in data || 'error' in pulverizaciones)
    return (
      <p className='px-4'>
        {((data as APIError) || (pulverizaciones as APIError)).message}
      </p>
    );

  return (
    <PulverizacionDetailContainer
      data={data}
      pulverizaciones={pulverizaciones}
    />
  );
}
