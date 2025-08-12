import { RedirectType, redirect } from 'next/navigation';

import { AddOrEditCampoDialog } from './campos-dialog';
import { Button } from './ui/button';
import { cookies } from 'next/headers';
import { getCampos } from '@/services/campos.service';

export default async function AddCampoContainer() {
  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');
  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  const campos = await getCampos(access_token.value, refresh_token);

  if ('error' in campos) return <Button disabled>No disponible</Button>;

  return <AddOrEditCampoDialog storedData={campos} />;
}
