import { RedirectType, redirect } from 'next/navigation';

import { APIError } from '@/types/error.types';
import { CropsTreatmentsTabs } from './crops&treatments-tabs';
import { cookies } from 'next/headers';
import { getCrops } from '@/services/crops.service';
import { getTreatments } from '@/services/treatments.service';

interface Props {
  nombre: string;
}

export default async function CropsTreatmentsContainer({ nombre }: Props) {
  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');
  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  let cultivos = await getCrops(access_token.value, refresh_token);
  let tratamientos = await getTreatments(access_token.value, refresh_token);
  if ('error' in cultivos || 'error' in tratamientos)
    return <p>{((cultivos ?? tratamientos) as APIError)?.message}</p>;

  cultivos = cultivos.filter((item) =>
    item.nombre.toLowerCase().includes(nombre.toLowerCase()),
  );
  tratamientos = tratamientos.filter((item) =>
    item.nombre.toLowerCase().includes(nombre.toLowerCase()),
  );

  return (
    <CropsTreatmentsTabs cultivos={cultivos} tratamientos={tratamientos} />
  );
}
