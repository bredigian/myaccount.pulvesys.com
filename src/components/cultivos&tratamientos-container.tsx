import { RedirectType, redirect } from 'next/navigation';

import CultivosTratamientosTabs from './cultivos&tratamientos-tabs';
import { cookies } from 'next/headers';
import { getCultivos } from '@/services/cultivos.service';
import { getTratamientos } from '@/services/tratamientos.service';
import { APIError } from '@/types/error.types';

interface Props {
  nombre: string;
}

export default async function CultivosTratamientosContainer({ nombre }: Props) {
  const access_token = (await cookies()).get('access_token');
  if (!access_token) redirect('/', RedirectType.replace);

  let cultivos = await getCultivos(access_token.value);
  let tratamientos = await getTratamientos(access_token.value);
  if ('error' in cultivos || 'error' in tratamientos)
    return <p>{((cultivos ?? tratamientos) as APIError)?.message}</p>;

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
