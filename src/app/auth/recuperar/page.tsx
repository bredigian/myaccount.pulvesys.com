import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import Image from 'next/image';
import { ResetPasswordForm } from '@/components/recover-form';
import dark from '../../../../public/logo_for_dark.webp';
import light from '../../../../public/logo_for_light.webp';
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
      <div className='flex flex-col items-center gap-4'>
        <Image
          src={dark}
          alt='Logo de PulveSys'
          className='hidden size-36 rounded-xl dark:block'
        />
        <Image
          src={light}
          alt='Logo de PulveSys'
          className='block size-36 rounded-xl dark:hidden'
        />
      </div>
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
