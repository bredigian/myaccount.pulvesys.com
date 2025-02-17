'use client';

import {
  AddOrEditProductoDialog,
  DeleteProductoDialog,
} from './productos-dialog';

import { Badge } from './ui/badge';
import { Producto, UNIDAD } from '@/types/productos.types';
import { UUID } from 'crypto';
import { TableCell, TableRow } from './ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

interface Props {
  producto: Producto;
}

export default function ProductoItem({ producto }: Props) {
  const { unidad } = producto;
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
      <TableCell className=''>{producto.nombre}</TableCell>
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
