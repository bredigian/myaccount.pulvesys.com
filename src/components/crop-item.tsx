'use client';

import { AddOrEditCropDialog, DeleteCropDialog } from './crops-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { TableCell, TableRow } from './ui/table';

import { Button } from './ui/button';
import { Crop } from '@/types/crops.types';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { UUID } from 'crypto';

const ColorItem = ({ color }: { color: Crop['color'] }) => {
  return (
    <div className='flex items-center gap-2'>
      <div className='size-4 rounded-sm' style={{ backgroundColor: color }} />
      <p>{color}</p>
    </div>
  );
};

interface Props {
  data: Crop;
}

export default function CropItem({ data }: Props) {
  return (
    <TableRow className='h-12'>
      <TableCell className=''>{data.nombre}</TableCell>
      <TableCell className=''>
        {data.color ? <ColorItem color={data.color} /> : 'Sin espec.'}
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
              <AddOrEditCropDialog isEdit data={data} />
              <DeleteCropDialog id={data.id as UUID} />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
