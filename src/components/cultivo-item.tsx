'use client';

import { AddOrEditCultivoDialog, DeleteCultivoDialog } from './cultivos-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { TableCell, TableRow } from './ui/table';

import { Button } from './ui/button';
import { CloudOffIcon } from 'lucide-react';
import { Cultivo } from '@/types/cultivos.types';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { UUID } from 'crypto';

interface Props {
  data: Cultivo;
}

export default function CultivoItem({ data }: Props) {
  const { isCached } = data;

  return (
    <TableRow className='h-12'>
      <TableCell>
        {isCached ? (
          <div className='flex w-fit items-center gap-1 rounded-md bg-yellow-300 p-1 px-2 dark:text-primary-foreground'>
            <CloudOffIcon className='size-3.5' />
            {data.nombre}
          </div>
        ) : (
          data.nombre
        )}
      </TableCell>
      <TableCell align='right'>
        <DropdownMenu modal={false} key={'manage-tratamiento-dropdown'}>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <DotsHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuGroup className='flex flex-col gap-2 p-2'>
              <AddOrEditCultivoDialog isEdit data={data} />
              <DeleteCultivoDialog id={data.id as UUID} />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
