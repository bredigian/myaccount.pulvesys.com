import Image from 'next/image';
import logo from '../../../public/logo_dalle.webp';
import SignupForm from '@/components/signup-form';

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
            src={logo}
            alt='Logo de PulveSys'
            className='size-full rounded-xl'
          />
        </div>
      </section>
      <SignupForm />
    </main>
  );
}
