import { RedirectType, redirect } from 'next/navigation';

import { cookies } from 'next/headers';
import { getPulverizaciones } from '@/services/pulverizaciones.service';
import PulverizacionesGridContainer from './pulverizaciones-grid-container';

export const PulverizacionesContainer = async () => {
  const access_token = (await cookies()).get('access_token');
  if (!access_token) redirect('/', RedirectType.replace);

  const data = await getPulverizaciones(access_token.value);
  if (data instanceof Error) return <p>{data?.message}</p>;

  return <PulverizacionesGridContainer data={data} />;
};
