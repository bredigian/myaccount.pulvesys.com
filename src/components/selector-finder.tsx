import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ReactNode, useState } from 'react';

import { Application } from '@/types/applications.types';
import { Button } from './ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { Crop } from '@/types/crops.types';
import { Location } from '@/types/locations.types';
import { Product } from '@/types/products.types';
import { Treatment } from '@/types/treatments.types';
import { normalize } from '@/lib/utils';

type SelectorType = 'Ubicación' | 'Cultivo' | 'Tratamiento' | 'Producto';

interface Props {
  data: Location[] | Crop[] | Treatment[] | Product[];
  selectedValue: string;
  selectedColor?: string | null;
  onSelectValue: (value: string) => void;
  className?: string;
  type: SelectorType;
  placeholder: string;
  customAlign?: 'center' | 'start' | 'end' | undefined;
  aplicaciones?: Application[];
  externalModalTrigger?: ReactNode;
}

export default function SelectorFinder({
  data,
  selectedValue,
  selectedColor,
  onSelectValue,
  className,
  type,
  placeholder,
  customAlign,
  aplicaciones,
  externalModalTrigger,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='justify-between'
        >
          {selectedValue && type === 'Cultivo' ? (
            <div className='flex items-center gap-2 truncate'>
              <div
                className='aspect-square size-4 rounded-sm'
                style={{ backgroundColor: selectedColor ?? 'transparent' }}
              />
              <span className='truncate'>{selectedValue}</span>
            </div>
          ) : (
            <p className='truncate'>{selectedValue || type}</p>
          )}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0' align={customAlign ?? 'start'}>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty className='p-3 text-sm'>
              No se encontraron resultados
            </CommandEmpty>
            <CommandGroup heading={externalModalTrigger}>
              {data.map((i) => (
                <CommandItem
                  key={i.id}
                  value={`${normalize(i.nombre)}__${i.id}`}
                  onSelect={(value) => {
                    onSelectValue(value.split('__')[1]);
                    setOpen(false);
                  }}
                  disabled={
                    type === 'Producto'
                      ? aplicaciones?.find((a) => a.producto_id === i.id)
                        ? true
                        : false
                      : false
                  }
                >
                  {type === 'Cultivo' && (
                    <div
                      className='size-4 rounded-sm'
                      style={{
                        backgroundColor: (i as Crop).color ?? 'transparent',
                      }}
                    />
                  )}
                  <span>
                    {i.nombre}
                    {type === 'Ubicación'
                      ? ` (${(i as Location).Lote?.reduce((acc, lote) => acc + (lote?.hectareas as number), 0).toFixed(2)})`
                      : ''}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
