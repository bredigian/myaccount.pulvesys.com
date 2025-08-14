import { ArrowRight, Construction } from 'lucide-react';
import { ENTERPRISE_ROUTES, EXTRAS_ROUTES, ROUTES } from '@/routes';
import { RedirectType, redirect } from 'next/navigation';

import Link from 'next/link';

export default function EnterprisePage() {
  return redirect('/dashboard', RedirectType.replace);

  return (
    <main className='flex flex-col items-center gap-6 p-4 pt-0'>
      <section className='flex flex-col items-center gap-4'>
        <Construction className='size-32 shrink-0 self-center text-muted-foreground md:size-52' />
        <p className='max-w-2xl text-lg font-semibold text-muted-foreground md:text-xl lg:text-2xl'>
          Proximamente...
        </p>
      </section>
      <p className='text-muted-foreground md:text-lg'>
        Explorá las demás rutas:
      </p>
      <section className='flex flex-col gap-4 rounded-md bg-primary/10 p-4 text-muted-foreground'>
        <ul className='flex flex-col items-start gap-2'>
          {ENTERPRISE_ROUTES.filter((route) => route.title !== 'Panel').map(
            (route) => (
              <Link
                key={route.title}
                href={route.url}
                className='flex items-center gap-2 text-base text-muted-foreground hover:underline md:text-xl'
              >
                <ArrowRight />
                {route.title}
              </Link>
            ),
          )}
        </ul>
        <ul className='flex flex-col items-start gap-2'>
          {ROUTES.map((route) => (
            <Link
              key={route.title}
              href={route.url}
              className='flex items-center gap-2 text-base text-muted-foreground hover:underline md:text-xl'
            >
              <ArrowRight />
              {route.title}
            </Link>
          ))}
        </ul>
        <ul className='flex flex-col items-start gap-2'>
          {EXTRAS_ROUTES.map((route) => (
            <Link
              key={route.title}
              href={route.url}
              className='flex items-center gap-2 text-base text-muted-foreground hover:underline md:text-xl'
            >
              <ArrowRight />
              {route.title}
            </Link>
          ))}
        </ul>
      </section>
    </main>
  );
}
