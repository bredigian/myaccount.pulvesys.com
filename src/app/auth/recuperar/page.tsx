import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import Image from 'next/image';
import { ResetPasswordForm } from '@/components/recover-form';
import original from '../../../../public/logo_dalle.webp';
import { redirect } from 'next/navigation';
import { verifyRecoverToken } from '@/services/auth.service';

interface Props {
  searchParams: Promise<{ token: string }>;
}

export default async function RecuperarContraseña({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!token) redirect('/');

  const verifed = await verifyRecoverToken(token);
  const hasError = 'error' in verifed;

  return (
    <main className='flex min-h-dvh w-full flex-col items-center justify-center gap-8 p-8 md:flex-row md:gap-16'>
      <Image
        src={original}
        alt='Logo de PulveSys'
        className='size-36 rounded-xl'
      />
      {hasError ? (
        <p>El token es inválido o ya caducó.</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Restablecer contraseña</CardTitle>
            <CardDescription>
              Completa el formulario con tu nueva contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm token={token} />
          </CardContent>
        </Card>
      )}
    </main>
  );
}
