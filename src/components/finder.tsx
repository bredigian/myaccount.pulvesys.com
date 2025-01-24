'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

export default function Finder() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((value: string) => {
    const parsedValue = value.trim();
    const params = new URLSearchParams(searchParams);
    if (parsedValue) params.set('nombre', parsedValue.toLowerCase());
    else params.delete('nombre');

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className='relative flex items-center'>
      <Search className='absolute pl-2 opacity-50' />
      <Input
        defaultValue={searchParams?.get('nombre')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder='Buscar'
        className='pl-7'
      />
    </div>
  );
}
