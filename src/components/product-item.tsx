'use client';

import { AddOrEditProductDialog, DeleteProductDialog } from './products-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Product, UNITY } from '@/types/products.types';
import { TableCell, TableRow } from './ui/table';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { UUID } from 'crypto';

interface Props {
  producto: Product;
}

export default function ProductItem({ producto }: Props) {
  const { unidad } = producto;
  const parsedUnidad = unidad
    .charAt(0)
    .concat(unidad.substring(1).toLowerCase());
  const bgColor =
    unidad === UNITY.GRAMOS
      ? 'bg-primary/60 text-secondary hover:text-secondary'
      : unidad === UNITY.KILOGRAMOS
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
              <AddOrEditProductDialog isEdit data={producto} />
              <DeleteProductDialog id={producto.id as UUID} />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
