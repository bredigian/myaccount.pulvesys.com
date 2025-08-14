'use client';

import { LOG_NAME, Log } from '@/types/logs.types';
import { TableCell, TableRow } from './ui/table';

import { DateTime } from 'luxon';
import { userStore } from '@/store/user.store';

interface Props {
  data: Log;
}

export default function HistorialItem({ data }: Props) {
  const { createdAt, usuario, type, description } = data;
  const nombreCompleto = usuario
    ? usuario?.nombre?.concat(' ').concat(usuario?.apellido as string)
    : 'No disponible';

  const { rol } = userStore();

  const isEnterprise = rol === 'EMPRESA';

  return (
    <TableRow className='h-12'>
      <TableCell>
        {DateTime.fromJSDate(new Date(createdAt))
          .setLocale('es-AR')
          .toLocaleString(
            {
              dateStyle: 'short',
              hourCycle: 'h23',
              timeStyle: 'medium',
            },
            DateTime.DATETIME_SHORT_WITH_SECONDS,
          )}
      </TableCell>
      <TableCell>{LOG_NAME[type]}</TableCell>
      {isEnterprise && <TableCell>{nombreCompleto}</TableCell>}
      <TableCell>{description}</TableCell>
    </TableRow>
  );
}
