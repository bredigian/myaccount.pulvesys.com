import { getCampos } from '@/services/campos.service';
import { getCultivos } from '@/services/cultivos.service';
import { getProductos } from '@/services/productos.service';
import { getTratamientos } from '@/services/tratamientos.service';
import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from './ui/button';
import { AllData } from '@/types/root.types';
import { ReloadIcon } from '@radix-ui/react-icons';
import { AddOrEditPulverizacionDialog } from './pulverizaciones-dialog';

export default async function FetchDataContainerForAddPulverizacionForm() {
  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');
  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  const campos = await getCampos(access_token.value, refresh_token);
  const cultivos = await getCultivos(access_token.value, refresh_token);
  const tratamientos = await getTratamientos(access_token.value, refresh_token);
  const productos = await getProductos(access_token.value, refresh_token);

  if (
    campos instanceof Error ||
    cultivos instanceof Error ||
    tratamientos instanceof Error ||
    productos instanceof Error
  )
    return (
      <Button type='button' disabled>
        No disponible
      </Button>
    );

  const data: AllData = { campos, cultivos, tratamientos, productos };

  return (
    <Suspense
      fallback={
        <Button disabled size={'icon'}>
          <ReloadIcon className='animate-spin' />
        </Button>
      }
    >
      <AddOrEditPulverizacionDialog data={data} />
    </Suspense>
  );
}
