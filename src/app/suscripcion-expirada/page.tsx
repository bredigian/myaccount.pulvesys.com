import { RedirectType, redirect } from 'next/navigation';

import { cookies } from 'next/headers';

export default async function SuscripcionExpiradaPage() {
  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');

  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  return (
    <main>
      <h1>La suscripcion está expirada. Contactate con tu administrador.</h1>
    </main>
  );
}
