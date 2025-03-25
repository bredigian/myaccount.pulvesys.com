import { RedirectType, redirect } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

import UsuarioItem from './usuario-item';
import { cookies } from 'next/headers';
import { getUsuariosByEmpresaId } from '@/services/usuarios.service';

interface Props {
  filter: string;
}

export default async function UsuariosContainer({ filter }: Props) {
  const access_token = (await cookies()).get('access_token');
  const refresh_token = (await cookies()).get('refresh_token');
  if (!access_token || !refresh_token) redirect('/', RedirectType.replace);

  let data = await getUsuariosByEmpresaId(access_token.value, refresh_token);
  if ('error' in data) return <p>{data?.message}</p>;

  const filteredData = !filter
    ? data
    : data.filter(
        (item) =>
          item?.nombre
            ?.concat(item?.apellido)
            .toLowerCase()
            .includes(filter.replaceAll(' ', '').toLowerCase()) ||
          item.email.toLowerCase().includes(filter.trim().toLowerCase()) ||
          item.nombre_usuario
            ?.toLowerCase()
            .includes(filter.trim().toLowerCase()) ||
          item.nro_telefono.includes(filter),
      );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Apellido</TableHead>
          <TableHead>Correo electrónico</TableHead>
          <TableHead>Nombre de usuario</TableHead>
          <TableHead>Nro. de teléfono</TableHead>
          <TableHead>ID</TableHead>
          <TableHead className='text-end'>Opciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.length === 0 ? (
          <TableRow className='h-12'>
            <TableCell>No se encontraron usuarios</TableCell>
          </TableRow>
        ) : (
          filteredData.map((usuario) => (
            <UsuarioItem key={usuario.id} data={usuario} />
          ))
        )}
      </TableBody>
    </Table>
  );
}
