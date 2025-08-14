import { RedirectType, redirect } from 'next/navigation';

import { AddOrEditLocationDialog } from './locations-dialog';
import { Button } from './ui/button';
import { cookies } from 'next/headers';
import { getCrops } from '@/services/crops.service';
import { getLocations } from '@/services/locations.service';
import { getSprays } from '@/services/sprays.service';

export default async function AddLocationContainer() {
  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');
  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  const campos = await getLocations(access_token.value, refresh_token);
  const cultivos = await getCrops(access_token.value, refresh_token);
  const pulverizaciones = await getSprays(access_token.value, refresh_token);

  if ('error' in campos || 'error' in cultivos || 'error' in pulverizaciones)
    return <Button disabled>No disponible</Button>;

  return (
    <AddOrEditLocationDialog
      storedData={campos}
      cultivos={cultivos}
      pulverizaciones={pulverizaciones}
    />
  );
}
