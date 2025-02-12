import { CSSProperties } from 'react';
import { Lote } from '@/types/campos.types';
import { Tag } from 'lucide-react';

interface Props {
  lote: Lote;
  customStyle?: CSSProperties;
  onClick?: () => void;
}
export default function LoteItem({ lote, customStyle, onClick }: Props) {
  return (
    <li
      style={
        customStyle ?? {
          backgroundColor: `${lote.color as string}75`,
          borderColor: lote.color as string,
        }
      }
      className='flex items-center gap-1 rounded-md border-2 px-3 py-1 text-xs font-semibold hover:cursor-pointer'
      onClick={onClick}
    >
      <Tag size={14} />
      <span>{lote.nombre}</span>
      <p>({lote.hectareas}ha)</p>
    </li>
  );
}
