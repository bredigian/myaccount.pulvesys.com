import {
  BackToPulverizacionesButton,
  EditConsumoProductoDialog,
  ShowPulverizacionInfoDialog,
} from '@/components/pulverizacion-detail-dialog';
import { Calendar, Layers, Leaf, ListCheckIcon, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RedirectType, redirect } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { AplicacionConConsumo } from '@/types/aplicaciones.types';
import { Badge } from '@/components/ui/badge';
import { ConsumoProducto } from '@/types/productos.types';
import { DateTime } from 'luxon';
import { Lote } from '@/types/campos.types';
import Map from '@/components/map';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import { UUID } from 'crypto';
import { cn } from '@/lib/utils';
import { cookies } from 'next/headers';
import { getById } from '@/services/pulverizaciones.service';

type Params = Promise<{ id: UUID }>;

interface Props {
  searchParams: Params;
}

export default async function PulverizacionDetail({ searchParams }: Props) {
  const { id } = await searchParams;
  if (!id) redirect('/panel', RedirectType.replace);

  const access_token = (await cookies()).get('access_token');
  if (!access_token) redirect('/', RedirectType.replace);

  const data: Pulverizacion | Error = await getById(id, access_token.value);

  if (data instanceof Error) return <p className='px-4'>{data.message}</p>;

  const selectedHectareas = data.detalle.campo?.Lote?.filter((lote) =>
    data.detalle.lotes.includes(lote.nombre as string),
  ).reduce((acc, lote) => acc + (lote?.hectareas as number), 0);

  return (
    <main className='space-y-4 p-4 pt-0'>
      <div className='flex w-full items-center justify-between'>
        <h1 className='text-2xl font-semibold'>{data.detalle.campo?.nombre}</h1>
        <aside className='flex items-center gap-2'>
          <ShowPulverizacionInfoDialog data={data} />
          <BackToPulverizacionesButton />
        </aside>
      </div>
      <div className='flex items-center justify-between'>
        <Badge className='space-x-1'>
          <Calendar size={14} />
          <p className='text-sm font-normal'>
            {DateTime.fromISO(data.fecha as string).toLocaleString(
              DateTime.DATE_SHORT,
              {
                locale: 'es-AR',
              },
            )}
          </p>
        </Badge>
        <ul className='flex flex-wrap items-center gap-2'>
          {data.detalle.campo?.Lote?.map((lote) => {
            const isOnPulverizacion = data.detalle.lotes.find(
              (selected) => selected === lote.nombre,
            );

            return (
              <li
                key={`badge-${lote.nombre}`}
                style={{
                  backgroundColor: `${lote.color as string}50`,
                  borderColor: lote.color as string,
                }}
                className={cn(
                  'flex items-center gap-1 rounded-md border-2 px-3 py-1 text-xs font-semibold',
                  isOnPulverizacion ? 'opacity-100' : 'opacity-50',
                )}
              >
                <Tag size={14} />
                <span>{lote.nombre}</span>
                <p>({lote.hectareas}ha)</p>
              </li>
            );
          })}
        </ul>
      </div>
      <Map
        lotes={data.detalle.campo?.Lote as Lote[]}
        customCenter
        size='!h-[25vh]'
        customZoom={14}
      />
      <Card>
        <CardHeader>
          <CardTitle>Detalle</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-wrap items-center gap-4'>
          <Badge variant={'secondary'} className='w-fit space-x-1'>
            <Layers size={14} />
            <h6>{selectedHectareas}ha</h6>
          </Badge>
          <Badge variant={'secondary'} className='w-fit space-x-1'>
            <Leaf size={14} />
            <h6>{data.detalle.cultivo?.nombre}</h6>
          </Badge>
          <Badge variant={'secondary'} className='w-fit space-x-1'>
            <ListCheckIcon size={14} />
            <h6>{data.detalle.tratamiento?.nombre}</h6>
          </Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-wrap items-center gap-4'>
          <ul className='w-full space-y-4'>
            {data.Aplicacion?.map((aplicacion) => {
              const consumo: ConsumoProducto = data.ConsumoProducto?.find(
                (item) => item.producto_id === aplicacion.producto?.id,
              ) as ConsumoProducto;

              const defaultValues: AplicacionConConsumo = {
                consumo_id: consumo.id,
                id: aplicacion.id,
                pulverizacion_id: aplicacion.pulverizacion_id,
                producto_id: aplicacion.producto_id,
                dosis: aplicacion.dosis,
                valor_real: consumo.valor_real,
                valor_teorico: consumo.valor_teorico,
                producto: aplicacion.producto,
              };

              return (
                <div key={aplicacion.id} className='w-full space-y-2'>
                  <div className='flex w-full items-center justify-between'>
                    <Badge variant={'secondary'} className='text-sm'>
                      {aplicacion.producto?.nombre}
                    </Badge>
                    <EditConsumoProductoDialog defaultValues={defaultValues} />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dosis</TableHead>
                        <TableHead>Teórico</TableHead>
                        <TableHead>Real</TableHead>
                        <TableHead>Restante</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{aplicacion.dosis}</TableCell>
                        <TableCell>
                          {consumo.valor_teorico.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {consumo.valor_real?.toFixed(2) ?? 'Sin espec.'}
                        </TableCell>
                        <TableCell>
                          {consumo.valor_devolucion?.toFixed(2) ?? 'Sin espec.'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
