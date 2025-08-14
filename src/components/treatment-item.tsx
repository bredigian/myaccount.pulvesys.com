'use client';

import {
  AddOrEditTreatmentDialog,
  DeleteTreatmentDialog,
} from './treatments-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { TableCell, TableRow } from './ui/table';

import { Button } from './ui/button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Treatment } from '@/types/treatments.types';
import { UUID } from 'crypto';

interface Props {
  data: Treatment;
}

export default function TreatmentItem({ data }: Props) {
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
              <AddOrEditTreatmentDialog isEdit data={data} />
              <DeleteTreatmentDialog id={data.id as UUID} />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
