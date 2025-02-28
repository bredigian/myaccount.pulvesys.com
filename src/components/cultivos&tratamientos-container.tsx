import { RedirectType, redirect } from 'next/navigation';

import CultivosTratamientosTabs from './cultivos&tratamientos-tabs';
import { cookies } from 'next/headers';
import { getCultivos } from '@/services/cultivos.service';
import { getTratamientos } from '@/services/tratamientos.service';

interface Props {
  nombre: string;
}

export default async function CultivosTratamientosContainer({ nombre }: Props) {
  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');
  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  let cultivos = await getCultivos(access_token.value, refresh_token);
  let tratamientos = await getTratamientos(access_token.value, refresh_token);
  if (cultivos instanceof Error || tratamientos instanceof Error)
    return <p>{((cultivos ?? tratamientos) as Error)?.message}</p>;

  cultivos = cultivos.filter((item) =>
    item.nombre.toLowerCase().includes(nombre.toLowerCase()),
  );
  tratamientos = tratamientos.filter((item) =>
    item.nombre.toLowerCase().includes(nombre.toLowerCase()),
  );

  return (
    <CultivosTratamientosTabs cultivos={cultivos} tratamientos={tratamientos} />
  );
}
