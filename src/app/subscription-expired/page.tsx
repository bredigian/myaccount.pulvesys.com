import { RedirectType, redirect } from 'next/navigation';

import { LogoutDialog } from '@/components/logout-dialog';
import { cookies } from 'next/headers';

export default async function SubscriptionExpiredPage() {
  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');

  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  return (
    <main className='flex min-h-dvh w-full flex-col items-center justify-center gap-4'>
      <h1 className='text-center text-lg font-medium'>
        ¡La suscripcion expiró!
        <br />
        Contactate con tu administrador.
      </h1>
      <LogoutDialog showText />
    </main>
  );
}
