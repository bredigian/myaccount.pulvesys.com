'use client';

import { Droplet, Droplets } from 'lucide-react';

import { Button } from './ui/button';

export default function PulverizacionesContainerEmpty() {
  const handleDialog = () => {
    const button = document.getElementById('add-pulverizacion__button');
    if (button) button.click();
  };

  return (
    <div className='flex flex-col items-start gap-4 p-4 md:mx-auto md:!mt-36 md:max-w-screen-sm'>
      <div
        className='flex items-center gap-4 opacity-50 dark:opacity-25'
        id='empty-container'
      >
        <Droplets className='size-32 shrink-0 lg:size-48' />
        <div className='flex flex-col gap-2 font-semibold sm:text-lg lg:text-2xl'>
          <p>Todavía no tenés ninguna orden generada.</p>
          <p>¡Creá la primera!</p>
        </div>
      </div>
      <Button
        variant={'secondary'}
        onClick={handleDialog}
        className='w-full md:w-fit md:self-end'
      >
        Crear
        <Droplet />
      </Button>
    </div>
  );
}
