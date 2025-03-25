'use client';

import {
  BackToPulverizacionesButton,
  EditConsumoProductoDialog,
  SharePulverizacionDialog,
  ShowPulverizacionInfoDialog,
} from '@/components/pulverizacion-detail-dialog';
import {
  Calendar,
  FileWarning,
  Layers,
  Leaf,
  ListCheckIcon,
  MessageCircleOff,
  MessageCircleWarning,
  Tag,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConsumoProducto, SHORT_UNIDAD, UNIDAD } from '@/types/productos.types';
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
import { DateTime } from 'luxon';
import { DeletePulverizacionDialog } from '@/components/pulverizaciones-dialog';
import Link from 'next/link';
import { Lote } from '@/types/campos.types';
import MapboxMap from './map';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import { UUID } from 'crypto';
import { cn } from '@/lib/utils';
import { usuarioStore } from '@/store/usuario.store';

interface Props {
  data: Pulverizacion;
}

export default function PulverizacionDetailContainer({ data }: Props) {
  const selectedHectareas = data?.detalle?.campo?.Lote?.filter((lote) =>
    data.detalle.lotes.includes(lote.nombre as string),
  ).reduce((acc, lote) => acc + (lote?.hectareas as number), 0);

  const { nombre, apellido } = usuarioStore();

  const lotesPulverizados = data?.detalle?.campo?.Lote?.filter((lote) =>
    data.detalle.lotes.includes(lote?.nombre as string),
  );

  console.log(data);
  const isFromEmployer =
    data.usuario?.rol === 'INDIVIDUAL' && data.usuario.empresa_id;

  return (
    <main className='space-y-6 p-4 pt-0'>
      <div className='flex w-full items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <BackToPulverizacionesButton />
          <h1 className='text-2xl font-semibold'>
            {data?.detalle?.campo?.nombre}
          </h1>
        </div>
        <aside className='flex items-center gap-2'>
          <SharePulverizacionDialog
            data={data}
            nombre={nombre}
            apellido={apellido}
          />
          <ShowPulverizacionInfoDialog data={data} />
          <DeletePulverizacionDialog id={data.id as UUID} />
        </aside>
      </div>
      <div className='flex flex-col gap-6'>
        {isFromEmployer && (
          <Link
            href={`/empresa/usuarios?filter=${data.usuario?.nombre}+${data.usuario?.apellido}`}
            className='flex w-fit items-center gap-2 rounded-md bg-primary/60 px-2 py-1 font-medium text-primary-foreground duration-200 ease-in-out hover:bg-primary'
          >
            <User size={16} />
            <span className='text-sm'>
              {data.usuario?.nombre} {data.usuario?.apellido}
            </span>
          </Link>
        )}
        <div className='flex items-start justify-between gap-4'>
          <ul className='flex flex-wrap items-center justify-start gap-2'>
            {lotesPulverizados?.length === 0 ? (
              <div
                key={`${data.id}-lote-empty`}
                className='flex items-center gap-1 overflow-hidden rounded-md border-2 bg-yellow-200 px-3 py-1 text-xs font-semibold hover:cursor-pointer'
              >
                <Tag size={14} />
                <span className='truncate'>Lote no disponible</span>
              </div>
            ) : (
              lotesPulverizados?.map((lote) => (
                <li
                  key={`badge-${lote.nombre}`}
                  style={{
                    backgroundColor: `${lote.color as string}75`,
                    borderColor: lote.color as string,
                  }}
                  className={cn(
                    'inline-flex space-x-1 rounded-md border-2 px-3 py-1 text-xs font-semibold',
                  )}
                >
                  <Tag size={14} />
                  <span>{lote.nombre}</span>
                  <p>({lote.hectareas}ha)</p>
                </li>
              ))
            )}
          </ul>
          {/* <section className='flex flex-col items-end gap-2'>
            {isFromEmployer && (
              <span className='text-sm'>
                Creada por{' '}
                <strong>
                  {data.usuario?.nombre} {data.usuario?.apellido}
                </strong>
              </span>
            )} */}
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
          {/* </section> */}
        </div>
        <div className='flex w-full flex-col gap-6 lg:flex-row'>
          <MapboxMap
            lotesCampo={data?.detalle?.campo?.Lote as Lote[]}
            lotesPulverizados={lotesPulverizados as Lote[]}
            customZoom={13}
            size='!h-[40dvh] lg:!h-[78.5vh]'
          />
          <div className='flex w-full flex-col gap-6 md:flex-row lg:flex-col'>
            <Card className='h-fit w-full'>
              <CardHeader>
                <CardTitle>Detalle</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-wrap items-center gap-4'>
                <Badge
                  variant={'secondary'}
                  className={cn(
                    'w-fit space-x-1',
                    selectedHectareas === 0 && 'bg-yellow-200',
                  )}
                >
                  {selectedHectareas === 0 ? (
                    <FileWarning size={14} />
                  ) : (
                    <Layers size={14} />
                  )}
                  <h6>{selectedHectareas}ha</h6>
                </Badge>
                <Badge variant={'secondary'} className='w-fit space-x-1'>
                  <Leaf size={14} />
                  <h6>{data?.detalle?.cultivo?.nombre}</h6>
                </Badge>
                <Badge variant={'secondary'} className='w-fit space-x-1'>
                  <ListCheckIcon size={14} />
                  <h6>{data?.detalle?.tratamiento?.nombre}</h6>
                </Badge>
                <Badge
                  variant={'secondary'}
                  className={cn(
                    'flex w-fit items-center gap-1',
                    data?.detalle?.observacion
                      ? '!bg-yellow-200'
                      : 'bg-secondary',
                  )}
                >
                  {data?.detalle?.observacion ? (
                    <MessageCircleWarning size={14} className='flex-shrink-0' />
                  ) : (
                    <MessageCircleOff size={14} className='flex-shrink-0' />
                  )}
                  <h6 className='break-words'>
                    {data?.detalle?.observacion || 'Sin observaciones'}
                  </h6>
                </Badge>
              </CardContent>
            </Card>
            <Card className='max-h-full w-full'>
              <CardHeader>
                <CardTitle>Productos</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-wrap items-center gap-4 overflow-y-auto'>
                <ul className='w-full space-y-4'>
                  {data?.Aplicacion?.map((aplicacion) => {
                    const consumo: ConsumoProducto =
                      data?.ConsumoProducto?.find(
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
                          <EditConsumoProductoDialog
                            defaultValues={defaultValues}
                          />
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Dosis</TableHead>
                              <TableHead>Cons. Teórico</TableHead>
                              <TableHead>Cons. Real</TableHead>
                              <TableHead>Prod. Restante</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className='overflow-auto'>
                            <TableRow>
                              <TableCell>
                                {aplicacion.dosis}
                                {
                                  SHORT_UNIDAD[
                                    aplicacion.producto?.unidad as UNIDAD
                                  ]
                                }
                                /ha
                              </TableCell>
                              <TableCell>
                                {consumo.valor_teorico.toLocaleString('es-AR')}
                                {
                                  SHORT_UNIDAD[
                                    aplicacion.producto?.unidad as UNIDAD
                                  ]
                                }
                              </TableCell>
                              <TableCell>
                                {consumo.valor_real
                                  ? `${consumo.valor_real?.toLocaleString('es-AR')}${
                                      SHORT_UNIDAD[
                                        aplicacion.producto?.unidad as UNIDAD
                                      ]
                                    }`
                                  : 'Sin espec.'}
                              </TableCell>
                              <TableCell>
                                {consumo.valor_devolucion
                                  ? `${consumo.valor_devolucion?.toLocaleString('es-AR')}${
                                      SHORT_UNIDAD[
                                        aplicacion.producto?.unidad as UNIDAD
                                      ]
                                    }`
                                  : 'Sin espec.'}
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
          </div>
        </div>
      </div>
    </main>
  );
}
