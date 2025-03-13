import Image from 'next/image';
import logo from '../../../public/logo_dalle.webp';
import SignupForm from '@/components/signup-form';
import { Label } from '@/components/ui/label';

export default function Signup() {
  return (
    <main className='flex min-h-dvh w-full flex-col items-center justify-start gap-8 p-8 lg:flex-row lg:gap-24'>
      <section className='flex w-full items-start justify-between gap-4'>
        <header className='flex h-min flex-col items-start gap-2'>
          <h3 className='text-xl font-medium'>Registrarse</h3>
          <p className='text-sm opacity-70'>
            Creá tu usuario y comenzá a disfrutar de la experiencia de PulveSys.
            Recordá que tenés <strong>1 mes de prueba</strong> sin necesidad de
            pagar nada 😉
          </p>
        </header>
        <div className='flex !size-28 shrink-0 flex-col items-center gap-4'>
          <Image
            src={logo}
            alt='Logo de PulveSys'
            className='size-full rounded-xl lg:size-64'
          />
        </div>
      </section>
      <Label htmlFor='nombre_input' className='self-start'>
        Completa el siguiente formulario
      </Label>
      <SignupForm />
    </main>
  );
}
