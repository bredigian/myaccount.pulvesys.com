'use client';

import {
  AddOrEditTratamientoDialog,
  DeleteTratamientoDialog,
} from './tratamientos-dialog';

import { Tratamiento } from '@/types/tratamientos.types';
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
  data: Tratamiento;
}

export default function TratamientoItem({ data }: Props) {
  return (
    <TableRow className='h-12'>
      <TableCell className=''>{data.nombre}</TableCell>
      <TableCell align='right'>
        <DropdownMenu modal={false} key={'manage-tratamiento-dropdown'}>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <DotsHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuGroup className='flex flex-col gap-2 p-2'>
              <AddOrEditTratamientoDialog isEdit data={data} />
              <DeleteTratamientoDialog id={data.id as UUID} />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
