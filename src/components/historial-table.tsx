'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

import HistorialItem from './historial-item';
import { Log } from '@/types/historial.types';
import { usuarioStore } from '@/store/usuario.store';

interface Props {
  data: Log[];
}

export default function HistorialTable({ data }: Props) {
  const { rol } = usuarioStore();
  const isEnterprise = rol === 'EMPRESA';

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Tipo</TableHead>
          {isEnterprise && <TableHead>Usuario</TableHead>}
          <TableHead>Descripción</TableHead>
          <TableHead>ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow className='h-12'>
            <TableCell colSpan={5}>
              No se encontraron registros en el historial.
            </TableCell>
          </TableRow>
        ) : (
          data.map((log) => <HistorialItem key={log.id} data={log} />)
        )}
      </TableBody>
    </Table>
  );
}
