'use client';

import {
  ArrowLeft,
  ExternalLink,
  FileCheck,
  FileDown,
  Info,
  PackageOpen,
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
import { ProductConsume, SHORT_UNITY, UNITY } from '@/types/products.types';
import autoTable, { RowInput } from 'jspdf-autotable';

import { ApplicationWithConsume } from '@/types/applications.types';
import { Button } from './ui/button';
import { DateTime } from 'luxon';
import { EditProductConsumeForm } from './spray-detail-form';
import Image from 'next/image';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Spray } from '@/types/sprays.types';
import { User } from '@/types/users.types';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/use-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  data?: Spray;
  defaultValues?: ApplicationWithConsume;

  handleShareByPDF?: () => Promise<void>;
  nombre?: User['nombre'];
  apellido?: User['apellido'];
}

export const ShowSprayInfoDialog = ({ data }: Props) => {
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

export const BackToSpraysButton = () => {
  const { back } = useRouter();

  return (
    <Button size={'icon'} variant={'outline'} onClick={back}>
      <ArrowLeft />
    </Button>
  );
};

export const EditProductConsumeDialog = ({ defaultValues }: Props) => {
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
        <EditProductConsumeForm
          defaultValues={defaultValues as ApplicationWithConsume}
          handleOpen={handleOpen}
        />
      </DrawerContent>
    </Drawer>
  );
};

type STATE = 'pending' | 'exporting' | 'exported';

export const ShareSprayDialog = ({ data, nombre, apellido }: Props) => {
  const isMobile = useIsMobile();

  const hasObservacion = data?.detalle.observacion;

  const [state, setState] = useState<STATE>('pending');

  const handleShareByPDF = async () => {
    setState('exporting');
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
        .text('PulveSys: Sistema de órdenes de pulverización', 105, 42, {
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

      pdf
        .setFontSize(11)
        .text(`Cultivo: ${data?.detalle.cultivo?.nombre}`, 14, 64);

      pdf
        .setFontSize(11)
        .text(`Tratamiento: ${data?.detalle.tratamiento?.nombre}`, 14, 72);

      if (hasObservacion) {
        const text = pdf.splitTextToSize(
          `Observación: ${data?.detalle.observacion}`,
          180,
        );

        pdf.setFontSize(11).text(text, 14, 80);
      }

      pdf
        .setFontSize(11)
        .text(
          `Campo: ${data?.detalle.campo?.nombre}`,
          14,
          !hasObservacion ? 88 : 96,
        );

      autoTable(pdf, {
        theme: 'grid',
        head: [['Lote', 'Hectáreas', 'Estado']],
        headStyles: { fillColor: '#243641' },
        body: data?.detalle.campo?.Lote?.map((lote) => [
          lote.nombre,
          `${lote.hectareas?.toFixed(2)}ha`,
          data.detalle.lotes.includes(lote?.nombre as string)
            ? 'A pulverizar'
            : 'Sin espec.',
        ]),

        margin: {
          top: !hasObservacion ? 96 : 104,
          left: 122,
        },
        tableId: 'lotes_table',
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 2) {
            data.cell.styles.fillColor =
              data.cell.raw === 'A pulverizar' ? [3, 223, 142] : [245, 203, 78];
            data.cell.styles.textColor = [0, 0, 0];
          }
        },
      });

      setTimeout(async () => {
        const mapElement = document.getElementById('map-for-pdf');
        if (mapElement) {
          const canvas = await html2canvas(mapElement);
          const imgData = canvas.toDataURL('image/png');

          pdf.addImage(
            imgData,
            'PNG',
            14,
            !hasObservacion ? 96 : 104,
            100,
            100,
          );
        }

        pdf.setFontSize(11).text('Productos', 14, !hasObservacion ? 218 : 224);

        autoTable(pdf, {
          theme: 'grid',
          head: [
            [
              'Producto',
              'Dosis',
              'Cons. Teórico',
              'Cons. Real',
              'Prod. Restante',
            ],
          ],
          headStyles: { fillColor: '#243641' },
          body: data?.Aplicacion?.map((aplicacion) => {
            const consumo: ProductConsume = data.ConsumoProducto?.find(
              (item) => item.producto_id === aplicacion.producto?.id,
            ) as ProductConsume;

            return [
              aplicacion.producto?.nombre,
              `${aplicacion.dosis.toLocaleString('es-AR')}${SHORT_UNITY[aplicacion.producto?.unidad as UNITY]}/ha`,
              `${consumo.valor_teorico.toLocaleString('es-AR')}${
                SHORT_UNITY[aplicacion.producto?.unidad as UNITY]
              }`,
              consumo.valor_real
                ? `${consumo.valor_real?.toLocaleString('es-AR')}${
                    SHORT_UNITY[aplicacion.producto?.unidad as UNITY]
                  }`
                : 'Sin espec.',
              consumo.valor_devolucion
                ? `${consumo.valor_devolucion?.toLocaleString('es-AR')}${
                    SHORT_UNITY[aplicacion.producto?.unidad as UNITY]
                  }`
                : 'Sin espec.',
            ] as RowInput;
          }),
          startY: !hasObservacion ? 226 : 232,

          tableId: 'productos_table',
        });

        const dateString = DateTime.fromISO(data?.fecha as string)
          .setLocale('es-AR')
          .toISODate();

        pdf.save(
          `Pulverización_${data?.detalle.campo?.nombre}_${dateString}_${data?.id}.pdf`,
        );

        setState('exported');
      }, 1000);
    } catch (e) {
      if (e instanceof Error)
        toast.error(e.message, { position: 'top-center' });
    }
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
            Exporta el detalle de la pulverización en formato PDF y compartilo
            con quien desees
          </DrawerDescription>
        </DrawerHeader>
        <Image
          src={'/logo_dalle.webp'}
          alt='Logo auxiliar de PulveSys'
          className='hidden size-2'
          id='pulvesys_logo'
          width={100}
          height={100}
        />
        <DrawerFooter className='pt-2'>
          <Button
            type='button'
            onClick={handleShareByPDF}
            disabled={state === 'exporting' || state === 'exported'}
            className={cn(
              state === 'exported' &&
                '!bg-green-700 text-primary-foreground disabled:opacity-100 dark:text-primary',
            )}
          >
            {state === 'pending' ? (
              <>
                Exportar como PDF <FileDown />
              </>
            ) : state === 'exporting' ? (
              <>
                Exportando <ReloadIcon className='animate-spin' />
              </>
            ) : (
              <>
                Exportado como PDF <FileCheck />
              </>
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant={'outline'} onClick={() => setState('pending')}>
              Cerrar
            </Button>
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
            Exporta el detalle de la pulverización en formato PDF y compartilo
            con quien desees
          </DialogDescription>
        </DialogHeader>
        <Image
          src={'/logo.png'}
          alt='Logo auxiliar de PulveSys'
          className='hidden size-2'
          id='pulvesys_logo'
          width={100}
          height={100}
        />
        <DialogFooter className='pt-2'>
          <Button
            type='button'
            onClick={handleShareByPDF}
            disabled={state === 'exporting' || state === 'exported'}
            className={cn(
              state === 'exported' &&
                '!bg-green-700 text-primary-foreground disabled:opacity-100 dark:text-primary',
            )}
          >
            {state === 'pending' ? (
              <>
                Exportar como PDF <FileDown />
              </>
            ) : state === 'exporting' ? (
              <>
                Exportando <ReloadIcon className='animate-spin' />
              </>
            ) : (
              <>
                Exportado como PDF <FileCheck />
              </>
            )}
          </Button>
          <DialogClose asChild>
            <Button variant={'outline'} onClick={() => setState('pending')}>
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
