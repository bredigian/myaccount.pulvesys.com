import { CSSProperties } from 'react';
import { Lote } from '@/types/campos.types';
import { Tag, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  lote: Lote;
  customStyle?: CSSProperties;
  onClick?: () => void;
  showButtonClear?: boolean;
  deleteLote?: () => void;
}
export default function LoteItem({
  lote,
  customStyle,
  onClick,
  showButtonClear,
  deleteLote,
}: Props) {
  return (
    <li
      className='flex items-center overflow-hidden rounded-md'
      onClick={onClick}
    >
      <div
        style={
          customStyle ?? {
            backgroundColor: `${lote.color as string}75`,
            borderColor: lote.color as string,
          }
        }
        className={cn(
          'flex items-center gap-1 overflow-hidden rounded-md border-2 px-3 py-1 text-xs font-semibold hover:cursor-pointer',
          showButtonClear && 'rounded-r-none border-r-0',
        )}
      >
        <Tag size={14} />
        <span className='truncate'>{lote.nombre}</span>
        <p>({lote.hectareas}ha)</p>
      </div>
      {showButtonClear && (
        <button
          type='button'
          style={{
            borderColor: lote.color as string,
            backgroundColor: `${lote.color}75` as string,
          }}
          className='h-full rounded-md rounded-l-none border-2 px-2 py-[5px] text-black'
          onClick={deleteLote}
        >
          <Trash size={14} />
        </button>
      )}
    </li>
  );
}
