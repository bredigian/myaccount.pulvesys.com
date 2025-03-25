'use client';

import { TableCell, TableRow } from './ui/table';

import { Usuario } from '@/types/usuario.types';

interface Props {
  data: Usuario;
}

export default function UsuarioItem({ data }: Props) {
  const { nombre, apellido, email, nombre_usuario, nro_telefono, id } = data;

  return (
    <TableRow className='h-12'>
      <TableCell className=''>{nombre}</TableCell>
      <TableCell className=''>{apellido}</TableCell>
      <TableCell className=''>{email}</TableCell>
      <TableCell className=''>{nombre_usuario}</TableCell>
      <TableCell className=''>{nro_telefono}</TableCell>
      <TableCell className=''>{id}</TableCell>
      {/* <TableCell align='right'>
        <DropdownMenu modal={false} key={'manage-user-dropdown'}>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <DotsHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuGroup className='flex flex-col gap-2 p-2'>

            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell> */}
    </TableRow>
  );
}
