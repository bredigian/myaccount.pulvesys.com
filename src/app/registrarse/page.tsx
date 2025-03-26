import Image from 'next/image';
import SignupForm from '@/components/signup-form';
import dark from '../../../public/logo_for_dark.webp';
import light from '../../../public/logo_for_light.webp';

export default function Signup() {
  return (
    <main className='flex min-h-dvh w-full flex-col items-center justify-start gap-8 p-8 lg:flex-row lg:gap-24 xl:mx-auto xl:max-w-screen-xl'>
      <section className='flex w-full items-start justify-between gap-4 md:gap-8 lg:flex-col'>
        <header className='flex h-min flex-col items-start gap-2 md:gap-4'>
          <h3 className='text-xl font-medium md:text-2xl lg:text-4xl'>
            Registrarse
          </h3>
          <p className='text-sm opacity-70 md:text-base'>
            Creá tu usuario y comenzá a disfrutar de la experiencia de{' '}
            <strong>PulveSys</strong>. Recordá que tenés{' '}
            <strong>1 mes de prueba</strong> sin necesidad de pagar nada 😉
          </p>
        </header>
        <div className='flex size-28 shrink-0 flex-col items-center gap-4 md:size-32 lg:size-40'>
          <Image
            src={dark}
            alt='Logo de PulveSys'
            className='hidden size-full rounded-xl dark:block'
          />
          <Image
            src={light}
            alt='Logo de PulveSys'
            className='block size-full rounded-xl dark:hidden'
          />
        </div>
      </section>
      <SignupForm />
    </main>
  );
}
