'use client';

import { LOG_NOMBRE, Log } from '@/types/historial.types';
import { TableCell, TableRow } from './ui/table';

import { DateTime } from 'luxon';
import { usuarioStore } from '@/store/usuario.store';

interface Props {
  data: Log;
}

export default function HistorialItem({ data }: Props) {
  const { id, createdAt, usuario, type, description } = data;
  const nombreCompleto = usuario
    ? usuario?.nombre?.concat(' ').concat(usuario?.apellido as string)
    : 'No disponible';

  const { rol } = usuarioStore();

  const isEnterprise = rol === 'EMPRESA';

  return (
    <TableRow className='h-12'>
      <TableCell>
        {DateTime.fromJSDate(new Date(createdAt))
          .setLocale('es-AR')
          .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}
      </TableCell>
      <TableCell>{LOG_NOMBRE[type]}</TableCell>
      {isEnterprise && <TableCell>{nombreCompleto}</TableCell>}
      <TableCell>{description}</TableCell>
      <TableCell>{id}</TableCell>
    </TableRow>
  );
}
