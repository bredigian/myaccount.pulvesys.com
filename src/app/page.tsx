import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import SigninForm from '@/components/signin-form';
import dark from '../../public/logo_for_dark.webp';
import light from '../../public/logo_for_light.webp';

interface Props {
  searchParams: Promise<{ session: string; expired: boolean }>;
}

export default async function Home({ searchParams }: Props) {
  const { session, expired } = await searchParams;

  return (
    <main className='flex h-dvh flex-col items-center justify-center gap-8 lg:flex-row lg:gap-24'>
      {session && expired === true && (
        <Badge className='bg-red-400'>La sesión ha expirado</Badge>
      )}
      <div className='flex flex-col items-center gap-4'>
        <Image
          src={dark}
          alt='Logo de PulveSys'
          className='hidden size-36 rounded-xl dark:block lg:size-64'
        />
        <Image
          src={light}
          alt='Logo de PulveSys'
          className='block size-36 rounded-xl dark:hidden lg:size-64'
        />
        {/* <h1 className='font-semibold opacity-75'>PulveSys</h1> */}
      </div>
      <SigninForm />
    </main>
  );
}
