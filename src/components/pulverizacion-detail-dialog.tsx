/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  ArrowLeft,
  ExternalLink,
  FileDown,
  Globe,
  Info,
  PackageOpen,
  ShieldCheck,
} from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import autoTable, { RowInput } from 'jspdf-autotable';

import { AplicacionConConsumo } from '@/types/aplicaciones.types';
import { Button } from './ui/button';
import { ConsumoProducto } from '@/types/productos.types';
import { DateTime } from 'luxon';
import EditConsumoProductoForm from './pulverizacion-detail-form';
import Image from 'next/image';
import { Input } from './ui/input';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import { Usuario } from '@/types/usuario.types';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/use-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  data?: Pulverizacion;
  defaultValues?: AplicacionConConsumo;

  handleShareByPDF?: () => Promise<void>;
  nombre?: Usuario['nombre'];
  apellido?: Usuario['apellido'];
}

export const ShowPulverizacionInfoDialog = ({ data }: Props) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='outline' size={'icon'}>
          <Info />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='z-[9999]'>
        <DrawerHeader>
          <DrawerTitle>Información</DrawerTitle>
          <DrawerDescription className='hidden'></DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-col gap-2 px-4 pb-4 text-sm opacity-75'>
          <p>
            Última vez modificado el{' '}
            {DateTime.fromISO(data?.updatedAt as string).toLocaleString(
              DateTime.DATETIME_SHORT,
              { locale: 'es-AR' },
            )}
          </p>
          <p>
            Creado el{' '}
            {DateTime.fromISO(data?.createdAt as string).toLocaleString(
              DateTime.DATETIME_SHORT,
              { locale: 'es-AR' },
            )}
          </p>
        </div>
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size={'icon'}>
          <Info />
        </Button>
      </DialogTrigger>
      <DialogContent className='z-[9999]'>
        <DialogHeader>
          <DialogTitle>Información</DialogTitle>
          <DialogDescription className='hidden'></DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2 px-4 pb-4 text-sm opacity-75 md:px-0 md:pb-0'>
          <p>
            Última vez modificado el{' '}
            {DateTime.fromISO(data?.updatedAt as string).toLocaleString(
              DateTime.DATETIME_SHORT,
              { locale: 'es-AR' },
            )}
          </p>
          <p>
            Creado el{' '}
            {DateTime.fromISO(data?.createdAt as string).toLocaleString(
              DateTime.DATETIME_SHORT,
              { locale: 'es-AR' },
            )}
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const BackToPulverizacionesButton = () => {
  const { back } = useRouter();

  return (
    <Button size={'icon'} variant={'outline'} onClick={back}>
      <ArrowLeft />
    </Button>
  );
};

export const EditConsumoProductoDialog = ({ defaultValues }: Props) => {
  const { open, setOpen, handleOpen } = useDialog();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={'outline'} size={'icon'}>
          <PackageOpen />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='z-[9999]'>
        <DrawerHeader>
          <DrawerTitle>
            Aplicación de {defaultValues?.producto?.nombre}
          </DrawerTitle>
          <DrawerDescription>
            Modifica con los valores de la aplicación del producto
          </DrawerDescription>
        </DrawerHeader>
        <EditConsumoProductoForm
          defaultValues={defaultValues as AplicacionConConsumo}
          handleOpen={handleOpen}
        />
      </DrawerContent>
    </Drawer>
  );
};

export const SharePulverizacionDialog = ({ data, nombre, apellido }: Props) => {
  const isMobile = useIsMobile();

  const handleShareByPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4', true);

    try {
      pdf.addImage({
        imageData: document.getElementById('pulvesys_logo') as HTMLImageElement,
        x: 95,
        y: 14,
        width: 20,
        height: 20,
      });

      pdf
        .setFontSize(10)
        .text('PulveSys: Sistema de Ordenes de Pulverización', 105, 42, {
          align: 'center',
        });

      pdf
        .setFontSize(11)
        .text(
          `Fecha: ${DateTime.fromISO(data?.fecha as string).toLocaleString(DateTime.DATE_SHORT, { locale: 'es-AR' })}`,
          14,
          56,
        );

      pdf.setFontSize(11).text(`Emitido por ${nombre} ${apellido}`, 194, 56, {
        align: 'right',
      });

      pdf.setFontSize(11).text(`Campo: ${data?.detalle.campo?.nombre}`, 14, 64);
      // pdf
      //   .setFontSize(11)
      //   .setTextColor(0, 0, 255)
      //   .text(`Ver mapa + detalle`, 194, 64, { align: 'right' })
      //   .link(161, 62, 33, 2, {
      //     url: `${window.location.origin}/publico/${data?.id}`,
      //   });

      // pdf.setDrawColor(0, 0, 255).line(161, 65, 194, 65);
      // pdf.setTextColor(0, 0, 0);

      pdf
        .setFontSize(11)
        .text(`Cultivo: ${data?.detalle.cultivo?.nombre}`, 14, 72);

      pdf
        .setFontSize(11)
        .text(`Tratamiento: ${data?.detalle.tratamiento?.nombre}`, 14, 80);

      pdf.setFontSize(11).text('Lotes y Productos', 14, 96);

      autoTable(pdf, {
        theme: 'grid',
        head: [['Lote', 'Hectáreas', 'Pulverizado']],
        headStyles: { fillColor: '#243641' },
        body: data?.detalle.campo?.Lote?.map((lote) => [
          lote.nombre,
          `${lote.hectareas}ha`,
          data.detalle.lotes.includes(lote?.nombre as string) ? 'Si' : 'No',
        ]),
        columnStyles: {
          0: { cellWidth: 82 },
          1: { cellWidth: 60 },
          2: { cellWidth: 40 },
        },
        margin: {
          top: 102,
        },
        tableId: 'lotes_table',
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 2) {
            data.cell.styles.fillColor =
              data.cell.raw === 'Si' ? [3, 223, 142] : [245, 203, 78];
            data.cell.styles.textColor = [0, 0, 0];
          }
        },
      });

      autoTable(pdf, {
        theme: 'grid',
        head: [['Producto', 'Dosis', 'Teórico', 'Real', 'Restante']],
        headStyles: { fillColor: '#243641' },
        body: data?.Aplicacion?.map((aplicacion) => {
          const consumo: ConsumoProducto = data.ConsumoProducto?.find(
            (item) => item.producto_id === aplicacion.producto?.id,
          ) as ConsumoProducto;

          return [
            aplicacion.producto?.nombre,
            aplicacion.dosis,
            consumo.valor_teorico,
            consumo.valor_real ?? 'Sin espec.',
            consumo.valor_devolucion ?? 'Sin espec.',
          ] as RowInput;
        }),
        tableId: 'productos_table',
      });

      pdf.save(`pulverizacion_${data?.detalle.campo?.nombre}_${data?.id}.pdf`);
    } catch (e) {
      if (e instanceof Error)
        toast.error(e.message, { position: 'top-center' });
    }
  };

  const [copied, setCopied] = useState(false);

  const generateSignedURL = async () => {
    // try {
    //   const url: HTMLInputElement | null = document.querySelector(
    //     '#pulverizacion-public_link',
    //   );
    //   if (!url) throw new Error('No se encontró la URL');
    //   await navigator.clipboard.writeText(url.value);
    //   setCopied(true);
    //   setTimeout(() => setCopied(false), 2000);
    // } catch (e) {
    //   if (e instanceof Error) toast.error(e.message);
    // }
  };

  return isMobile ? (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='outline' size={'icon'}>
          <ExternalLink />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='z-[9999]'>
        <DrawerHeader>
          <DrawerTitle>Compartir</DrawerTitle>
          <DrawerDescription>
            Genera una URL segura con duración de hasta 7 días o exporta la
            información en formato PDF
          </DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-col gap-4 px-4 pb-4'>
          <Image
            src={'/logo.png'}
            alt='Logo auxiliar de PulveSys'
            className='hidden size-2'
            id='pulvesys_logo'
            width={100}
            height={100}
          />
          <div className='flex items-center gap-4'>
            <Input
              id='pulverizacion-public_link'
              placeholder='URL'
              disabled
              className='disabled:cursor-text disabled:select-text disabled:hover:cursor-text'
              onChange={() => null}
            />
            <Button
              onClick={generateSignedURL}
              disabled
              className={!copied ? '' : '!bg-green-700'}
            >
              {!copied ? (
                <>
                  Generar URL
                  <Globe />
                </>
              ) : (
                <>
                  URL generada
                  <ShieldCheck />
                </>
              )}
            </Button>
          </div>
          <p className='text-xs italic opacity-75'>
            *Generación de URL no disponible
          </p>
        </div>
        <DrawerFooter className='pt-2'>
          <Button type='button' onClick={handleShareByPDF}>
            Exportar como PDF <FileDown />
          </Button>
          <DrawerClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size={'icon'}>
          <ExternalLink />
        </Button>
      </DialogTrigger>
      <DialogContent className='z-[9999]'>
        <DialogHeader>
          <DialogTitle>Compartir</DialogTitle>
          <DialogDescription>
            Genera una URL segura con duración de hasta 7 días o exporta la
            información en formato PDF
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-4'>
            <Image
              src={'/logo.png'}
              alt='Logo auxiliar de PulveSys'
              className='hidden size-2'
              id='pulvesys_logo'
              width={100}
              height={100}
            />
            <Input
              id='pulverizacion-public_link'
              placeholder='URL'
              disabled
              className='disabled:cursor-text disabled:select-text disabled:hover:cursor-text'
              onChange={() => null}
            />
            <Button
              onClick={generateSignedURL}
              disabled
              className={!copied ? '' : '!bg-green-700'}
            >
              {!copied ? (
                <>
                  Generar URL
                  <Globe />
                </>
              ) : (
                <>
                  URL generada
                  <ShieldCheck />
                </>
              )}
            </Button>
          </div>
          <p className='text-sm italic opacity-75'>
            *Generación de URL no disponible
          </p>
        </div>
        <DialogFooter className='pt-2'>
          <Button type='button' onClick={handleShareByPDF}>
            Exportar como PDF <FileDown />
          </Button>
          <DialogClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
