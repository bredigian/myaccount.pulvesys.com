import Link from 'next/link';
import TerminosCondiciones from '@/components/terminos&condiciones';

export default function TerminosCondicionesPage() {
  return (
    <main className='flex flex-col gap-4 p-8'>
      <Link href={'/'} className='underline'>
        Ir al Inicio
      </Link>
      <TerminosCondiciones />
    </main>
  );
}
