import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { RecoverPasswordDialog } from '@/components/auth-dialog';
import { SigninForm } from '@/components/signin-form';
import original from '../../public/logo_dalle.webp';

interface Props {
  searchParams: Promise<{ session: string; expired: boolean }>;
}

export default async function HomePage({ searchParams }: Props) {
  const { session, expired } = await searchParams;

  return (
    <main className='flex h-dvh flex-col items-center justify-center gap-8 lg:gap-0'>
      {session && expired === true && (
        <Badge className='bg-red-400'>La sesión ha expirado</Badge>
      )}
      <div className='flex flex-col items-center justify-center gap-8 lg:grow lg:flex-row lg:gap-24'>
        <Image
          src={original}
          alt='Logo de PulveSys'
          className='size-36 rounded-xl lg:size-48'
        />
        <Card>
          <CardHeader>
            <CardTitle className='text-center text-xl'>PulveSys</CardTitle>
            <CardDescription hidden></CardDescription>
          </CardHeader>
          <CardContent>
            <SigninForm />
          </CardContent>
          <CardFooter className='flex w-full items-center justify-center'>
            <RecoverPasswordDialog />
          </CardFooter>
        </Card>
      </div>
      <Link href={'/terms&conditions'} className='mb-12 text-xs underline'>
        Términos y Condiciones
      </Link>
    </main>
  );
}
