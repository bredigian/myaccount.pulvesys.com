'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { ReloadIcon } from '@radix-ui/react-icons';
import logo from '@/assets/logo.webp';
import { useRouter } from 'next/navigation';
import { verifyOfflineSession } from '@/lib/offline';

type STATUS = 'pending' | 'loading' | 'completed';

export default function OfflinePage() {
  const [status, setStatus] = useState<STATUS>('pending');
  const [error, setError] = useState('');

  const { push } = useRouter();

  useEffect(() => {
    const verifyLocalSession = async () => {
      setStatus('loading');

      const { isValid, error } = await verifyOfflineSession();
      if (!isValid) {
        setError(error!);
        setStatus('completed');
      } else push('/offline/panel');
    };

    verifyLocalSession();
  }, []);

  return (
    <main className='grid h-dvh w-full place-items-center'>
      {status !== 'completed' ? (
        <div className='flex flex-col items-center gap-4'>
          <Image
            alt='Logo de carga de PulveSys'
            src={logo}
            className='size-16 rounded-md'
          />
          <ReloadIcon className='size-6 animate-spin' />
        </div>
      ) : (
        <div className='flex flex-col items-center gap-2'>
          <h1>¡No tenés conexión a internet!</h1>
          <p>y {error.toLowerCase()}</p>
        </div>
      )}
    </main>
  );
}
