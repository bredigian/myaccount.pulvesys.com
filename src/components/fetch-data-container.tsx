import { RedirectType, redirect } from 'next/navigation';

import { AddOrEditSprayDialog } from './sprays-dialog';
import { AllData } from '@/types/root.types';
import { Button } from './ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { getCrops } from '@/services/crops.service';
import { getLocations } from '@/services/locations.service';
import { getProducts } from '@/services/products.service';
import { getSprays } from '@/services/sprays.service';
import { getTreatments } from '@/services/treatments.service';

export default async function FetchDataContainerForAddSprayForm() {
  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');
  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  const campos = await getLocations(access_token.value, refresh_token);
  const cultivos = await getCrops(access_token.value, refresh_token);
  const tratamientos = await getTreatments(access_token.value, refresh_token);
  const productos = await getProducts(access_token.value, refresh_token);
  const pulverizaciones = await getSprays(access_token.value, refresh_token);

  if (
    'error' in campos ||
    'error' in cultivos ||
    'error' in tratamientos ||
    'error' in productos ||
    'error' in pulverizaciones
  )
    return (
      <Button type='button' disabled>
        No disponible
      </Button>
    );

  const data: AllData = {
    campos,
    cultivos,
    tratamientos,
    productos,
    pulverizaciones,
  };

  return (
    <Suspense
      fallback={
        <Button disabled size={'icon'}>
          <ReloadIcon className='animate-spin' />
        </Button>
      }
    >
      <AddOrEditSprayDialog data={data} />
    </Suspense>
  );
}
