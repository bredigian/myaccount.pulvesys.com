'use client';

import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { Command, CommandGroup, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from './ui/button';
import { normalize } from '@/lib/utils';
import { useState } from 'react';

export type DIRECTION = 'asc' | 'desc';
export type SORT = 'fullname' | 'createdat' | 'updatedat';

enum SORT_VALUE {
  fullname = 'Nombre',
  createdat = 'Fecha de creación',
  updatedat = 'Fecha de modificación',
}

interface Props {
  defaultSort?: SORT;
  defaultDirection?: DIRECTION;
  className?: string;
}

export default function FilterSelector({
  defaultSort,
  defaultDirection,
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleFilter = (sort: string, direction: DIRECTION) => {
    const parsedSort = sort.trim().toLowerCase();
    const parsedDirection = direction.trim().toLowerCase();

    const params = new URLSearchParams(searchParams);

    params.set('sort', parsedSort);
    params.set('direction', parsedDirection);

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='justify-between'
        >
          {defaultSort
            ? SORT_VALUE[defaultSort as keyof typeof SORT_VALUE]
            : 'Ordenar'}
          {!defaultSort ? (
            <></>
          ) : defaultDirection === 'asc' ? (
            <ChevronUp />
          ) : (
            <ChevronDown />
          )}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0' align='start'>
        <Command>
          <CommandList>
            <CommandGroup heading='Ordenar'>
              <CommandItem
                value='fullname'
                onSelect={(value) => {
                  const parsedValue = normalize(value);
                  handleFilter(
                    parsedValue,
                    parsedValue !== defaultSort
                      ? (defaultDirection as DIRECTION)
                      : defaultDirection === 'asc'
                        ? 'desc'
                        : 'asc',
                  );
                  setOpen(false);
                }}
              >
                Nombre
              </CommandItem>
              <CommandItem
                value='createdAt'
                onSelect={(value) => {
                  const parsedValue = normalize(value);
                  handleFilter(
                    parsedValue,
                    parsedValue !== defaultSort
                      ? (defaultDirection as DIRECTION)
                      : defaultDirection === 'asc'
                        ? 'desc'
                        : 'asc',
                  );
                  setOpen(false);
                }}
              >
                Fecha de creación
              </CommandItem>
              <CommandItem
                value='updatedAt'
                onSelect={(value) => {
                  const parsedValue = normalize(value);
                  handleFilter(
                    parsedValue,
                    parsedValue !== defaultSort
                      ? (defaultDirection as DIRECTION)
                      : defaultDirection === 'asc'
                        ? 'desc'
                        : 'asc',
                  );
                  setOpen(false);
                }}
              >
                Fecha de modificación
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
