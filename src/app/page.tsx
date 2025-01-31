import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import SigninForm from '@/components/signin-form';
import logo from '../../public/logo_dalle.webp';

interface Props {
  searchParams: Promise<{ session: string; expired: boolean }>;
}

export default async function Home({ searchParams }: Props) {
  const { session, expired } = await searchParams;

  return (
    <main className='flex h-dvh flex-col items-center justify-center gap-8'>
      {session && expired === true && (
        <Badge className='bg-red-400'>La sesión ha expirado</Badge>
      )}
      <div className='flex flex-col items-center gap-4'>
        <Image
          src={logo}
          alt='Logo de PulveSys'
          className='size-36 rounded-xl'
        />
        <h1 className='font-semibold opacity-75'>PulveSys</h1>
      </div>
      <SigninForm />
    </main>
  );
}
