import { Cloud, Tag, Trash } from 'lucide-react';

import { CSSProperties } from 'react';
import { DeleteStoredLotDialog } from './lots-dialog';
import { Lot } from '@/types/locations.types';
import { cn } from '@/lib/utils';

interface Props {
  lote: Lot;
  customStyle?: CSSProperties;
  onClick?: () => void;
  showButtonClear?: boolean;
  deleteLote?: () => void;
  isEditting?: boolean;
  storedLotesQuantity?: number;
  color?: string;
}
export default function LotItem({
  lote,
  customStyle,
  onClick,
  showButtonClear,
  deleteLote,
  isEditting,
  storedLotesQuantity,
  color,
}: Props) {
  const hasMinimumLotesQuantity =
    storedLotesQuantity && storedLotesQuantity > 1;

  const isStored = lote.id ? true : false;

  return (
    <li className='relative flex w-fit flex-col items-start overflow-hidden'>
      {isEditting && isStored && (
        <div
          className='z-1 translate-x-0.5 translate-y-0.5 rounded-t-md border-2 border-primary bg-green-600 p-1 dark:border-primary-foreground'
          style={{ borderBottomColor: lote.color as string }}
        >
          <Cloud size={14} />
        </div>
      )}
      <div
        className='z-10 flex w-full items-center rounded-md'
        onClick={onClick}
      >
        <div
          style={
            customStyle ?? {
              backgroundColor: `${color as string}75`,
              borderColor: color as string,
            }
          }
          className={cn(
            'flex max-w-full items-center gap-1 rounded-md border-2 px-3 py-1 text-xs font-semibold',
            showButtonClear &&
              (hasMinimumLotesQuantity || !isStored) &&
              'rounded-r-none border-r-0',
          )}
        >
          <Tag size={14} className='flex-shrink-0' />
          <span className='truncate'>{lote.nombre}</span>
          <p>({lote.hectareas?.toFixed(2)}ha)</p>
        </div>
        {isEditting && hasMinimumLotesQuantity && isStored ? (
          <DeleteStoredLotDialog data={lote} />
        ) : (
          showButtonClear &&
          !isStored && (
            <button
              type='button'
              style={{
                borderColor: lote.color as string,
                backgroundColor: `${lote.color}75` as string,
              }}
              className='h-full rounded-md rounded-l-none border-2 px-2 py-[5px] text-primary'
              onClick={deleteLote}
            >
              <Trash size={14} />
            </button>
          )
        )}
      </div>
    </li>
  );
}
