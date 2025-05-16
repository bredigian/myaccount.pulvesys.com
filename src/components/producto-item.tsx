'use client';

import {
  AddOrEditProductoDialog,
  DeleteProductoDialog,
} from './productos-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Producto, UNIDAD } from '@/types/productos.types';
import { TableCell, TableRow } from './ui/table';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CloudOffIcon } from 'lucide-react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { UUID } from 'crypto';

interface Props {
  producto: Producto;
}

export default function ProductoItem({ producto }: Props) {
  const { unidad, isCached } = producto;
  const parsedUnidad = unidad
    .charAt(0)
    .concat(unidad.substring(1).toLowerCase());
  const bgColor =
    unidad === UNIDAD.GRAMOS
      ? 'bg-primary/60 text-secondary hover:text-secondary'
      : unidad === UNIDAD.KILOGRAMOS
        ? 'bg-primary/75 text-secondary hover:text-secondary'
        : 'bg-primary/90 text-secondary hover:text-secondary';

  return (
    <TableRow className='h-12'>
      <TableCell className=''>
        {isCached ? (
          <div className='flex w-fit items-center gap-1 rounded-md bg-yellow-300 p-1 px-2 dark:text-primary-foreground'>
            <CloudOffIcon className='size-3.5' />
            {producto.nombre}
          </div>
        ) : (
          producto.nombre
        )}
      </TableCell>
      <TableCell>
        <Badge variant={'default'} className={bgColor}>
          {parsedUnidad}
        </Badge>
      </TableCell>
      <TableCell align='right'>
        <DropdownMenu modal={false} key={'manage-productos-dropdown'}>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <DotsHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuGroup className='flex flex-col gap-2 p-2'>
              <AddOrEditProductoDialog isEdit data={producto} />
              <DeleteProductoDialog id={producto.id as UUID} />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
