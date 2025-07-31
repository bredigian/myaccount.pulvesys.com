'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

interface Props {
  param?: string;
  placeholder?: string;
}

export default function Finder({ param, placeholder }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((value: string) => {
    const parsedValue = value.trim();
    const params = new URLSearchParams(searchParams);
    if (parsedValue) params.set(param || 'nombre', parsedValue.toLowerCase());
    else params.delete(param || 'nombre');

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className='relative flex w-full items-center md:max-w-sm'>
      <Search className='absolute pl-2 opacity-50' />
      <Input
        defaultValue={searchParams?.get(param || 'nombre')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder ?? 'Buscar'}
        className='truncate pl-7 text-sm md:text-base'
      />
    </div>
  );
}
