'use client';

import { Campo, Coordinada, Lote } from '@/types/campos.types';
import {
  Check,
  ChevronDown,
  MapPinPlus,
  PackageMinus,
  PackagePlus,
} from 'lucide-react';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { Dialog, useDialog } from '@/hooks/use-dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { SHORT_UNIDAD, UNIDAD } from '@/types/productos.types';
import { useEffect, useState } from 'react';

import { APIError } from '@/types/error.types';
import { AllData } from '@/types/root.types';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import Cookies from 'js-cookie';
import { Cultivo } from '@/types/cultivos.types';
import { DateTime } from 'luxon';
import { Input } from './ui/input';
import { Label } from './ui/label';
import LoteItem from './lote-item';
import MapboxMap from './map';
import { PolygonFeature } from './campos-form';
import { Position } from 'geojson';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import { ReloadIcon } from '@radix-ui/react-icons';
import SelectorFinder from './selector-finder';
import { Tratamiento } from '@/types/tratamientos.types';
import { UUID } from 'crypto';
import { addPulverizacion } from '@/services/pulverizaciones.service';
import { cn } from '@/lib/utils';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useControllerAplicaciones } from '@/hooks/use-productos';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter } from 'next/navigation';

interface PulverizacionExtended extends Pulverizacion {
  campo_id: Campo['id'];
  cultivo_id: Cultivo['id'];
  tratamiento_id: Tratamiento['id'];
  observacion: Pulverizacion['detalle']['observacion'];
  lotes: Pulverizacion['detalle']['lotes'];
}

interface Props {
  handleOpen: () => void;
  handleExternalDialog: (dialog: Dialog) => void;
  camposDialog: Dialog;
  cultivosDialog: Dialog;
  tratamientosDialog: Dialog;
  productosDialog: Dialog;
  data: AllData;
}

export default function AddOrEditPulverizacionForm({
  handleOpen,
  handleExternalDialog,
  camposDialog,
  cultivosDialog,
  productosDialog,
  tratamientosDialog,
  data,
}: Props) {
  const { push } = useRouter();

  const storedDate =
    (
      JSON.parse(
        localStorage.getItem('pulverizacion_temporal') || '{}',
      ) as PulverizacionExtended
    ).fecha ?? undefined;

  const storedUbicacion =
    (
      JSON.parse(
        localStorage.getItem('pulverizacion_temporal') || '{}',
      ) as PulverizacionExtended
    ).campo_id ?? undefined;

  const storedCultivo =
    (
      JSON.parse(
        localStorage.getItem('pulverizacion_temporal') || '{}',
      ) as PulverizacionExtended
    ).cultivo_id ?? undefined;

  const storedTratamiento =
    (
      JSON.parse(
        localStorage.getItem('pulverizacion_temporal') || '{}',
      ) as PulverizacionExtended
    ).tratamiento_id ?? undefined;

  const storedLotes =
    (
      JSON.parse(
        localStorage.getItem('pulverizacion_temporal') || '{}',
      ) as PulverizacionExtended
    ).lotes ?? undefined;

  const storedObservacion =
    (
      JSON.parse(
        localStorage.getItem('pulverizacion_temporal') || '{}',
      ) as PulverizacionExtended
    ).observacion ?? undefined;

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
  } = useForm<Pulverizacion>({
    defaultValues: {
      fecha: !storedDate
        ? undefined
        : DateTime.fromISO(storedDate as string)?.toJSDate(),
      detalle: {
        campo: { id: storedUbicacion },
        cultivo: { id: storedCultivo },
        tratamiento: { id: storedTratamiento },
      },
    },
  });

  const [key, setKey] = useState(`form-${crypto.randomUUID()}`);

  const calendarDialog = useDialog();

  const [selectedCampo, setSelectedCampo] = useState<Campo | undefined>(
    storedUbicacion
      ? data.campos.find((item) => item.id === storedUbicacion)
      : undefined,
  );
  const [selectedLotes, setSelectedLotes] = useState<string[]>(
    storedLotes ?? [],
  );

  const [polygons, setPolygons] = useState<PolygonFeature[]>();

  useEffect(() => {
    if (selectedCampo)
      setPolygons(
        (selectedCampo?.Lote as Lote[]).map((l) => {
          const points = l.Coordinada as Coordinada[];

          const groupedByLoteId = points.reduce(
            (acc, coord) => {
              const { id, lng, lat, lote_id } = coord as Required<Coordinada>;
              if (!acc[lote_id]) acc[lote_id] = [];

              acc[lote_id].push([lng, lat, id as unknown as number]);
              return acc;
            },
            {} as Record<string, Position[]>,
          );

          return {
            id: l.id as UUID,
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: Object.values(groupedByLoteId),
            },
            properties: {
              description: `${l.nombre} (${l.hectareas?.toFixed(2)}ha)`,
              area: l.hectareas,
              nombre: l.nombre,
              color: l.color,
              opacity: selectedLotes.includes(l.nombre as string) ? 1 : 0.5,
            },
          } as PolygonFeature;
        }),
      );
  }, [selectedCampo, selectedLotes]);

  const {
    aplicaciones,
    addAplicacion,
    areEmptySelectedProducts,
    deleteAplicacion,
    handleChangeAplicacionDosis,
    handleChangeSelectValue,
    handleUpdateAplicacionesOnLocalStorage,
    clearAll,
  } = useControllerAplicaciones();

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<
    boolean | undefined
  >(undefined);

  const onInvalidSubmit = (errors: FieldErrors<Pulverizacion>) => {
    if (errors?.fecha)
      toast.error(errors.fecha.message, {
        position: 'top-center',
      });
    else if (errors?.detalle) {
      if (errors?.detalle?.cultivo?.id)
        toast.error(errors.detalle.cultivo.id.message, {
          position: 'top-center',
        });
      else if (errors?.detalle?.tratamiento?.id)
        toast.error(errors.detalle.tratamiento.id.message, {
          position: 'top-center',
        });
      else if (errors?.detalle?.observacion)
        toast.error(errors.detalle.observacion.message, {
          position: 'top-center',
        });
    }
  };
  const onSubmit = async (values: Pulverizacion) => {
    if (selectedLotes.length === 0) {
      toast.error('No hay lotes seleccionados.', {
        position: 'top-center',
      });
      return;
    }
    if (areEmptySelectedProducts) {
      toast.error('Hay productos incompletos.', {
        position: 'top-center',
      });

      return;
    }
    try {
      const PAYLOAD: Pulverizacion = {
        ...values,
        fecha: (values.fecha as Date).toISOString(),
        detalle: {
          campo: undefined,
          cultivo: undefined,
          tratamiento: undefined,
          id: undefined,
          campo_id: values.detalle.campo?.id as UUID,
          cultivo_id: values.detalle.cultivo?.id as UUID,
          tratamiento_id: values.detalle.tratamiento?.id as UUID,
          lotes: selectedLotes,
          observacion: values.detalle.observacion,
        },
        productos: aplicaciones,
      };

      const access_token = Cookies.get('access_token');
      if (!access_token) {
        toast.error('La sesión ha expirado', { position: 'top-center' });
        push('/');

        return;
      }

      await addPulverizacion(PAYLOAD, access_token);
      await revalidate('pulverizaciones');

      setIsSubmitSuccessful(true);

      localStorage.removeItem('pulverizacion_temporal');
      localStorage.removeItem('aplicaciones_temporal');

      setTimeout(() => handleOpen(), 1000);
    } catch (error) {
      const { statusCode, message } = error as APIError;

      toast.error(message);
      const unauthorized = statusCode === 401 || statusCode === 403;
      if (unauthorized) setTimeout(() => push('/'), 250);
    }
  };

  const cultivoSelector = useDialog();
  const tratamientoSelector = useDialog();

  const handleLocalStorage = (
    key: keyof PulverizacionExtended,
    value: PulverizacionExtended[keyof PulverizacionExtended],
  ) => {
    const pulverizacionTemporal = localStorage.getItem(
      'pulverizacion_temporal',
    );
    if (!pulverizacionTemporal)
      localStorage.setItem(
        'pulverizacion_temporal',
        JSON.stringify({
          [key]: key === 'lotes' ? [value] : value,
        } as Partial<Pulverizacion>),
      );
    else {
      const pulverizacion: PulverizacionExtended = JSON.parse(
        pulverizacionTemporal,
      );
      const haveStoredLotes = pulverizacion.lotes ? true : false;

      let updated: PulverizacionExtended = {
        ...pulverizacion,
        [key]:
          key !== 'lotes'
            ? value
            : !haveStoredLotes
              ? [value]
              : pulverizacion?.lotes?.includes(value as string)
                ? pulverizacion?.lotes?.filter((l) => l !== value)
                : [...pulverizacion.lotes, value],
      };
      if (key === 'campo_id') updated = { ...updated, lotes: [] };

      localStorage.setItem('pulverizacion_temporal', JSON.stringify(updated));
    }
  };

  const handleObservacion = useDebouncedCallback(
    (value: string) => handleLocalStorage('observacion', value),
    300,
  );

  useEffect(() => {
    handleUpdateAplicacionesOnLocalStorage();
  }, [aplicaciones]);

  return (
    <form
      key={key}
      onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
      className='grid max-h-[86dvh] grid-cols-10 gap-4 overflow-y-auto px-4 pb-4 md:px-0 md:pb-0'
      id='form-add-pulverizacion'
      data-vaul-no-drag
    >
      <Popover open={calendarDialog.open} onOpenChange={calendarDialog.setOpen}>
        <PopoverTrigger asChild>
          <Button
            type='button'
            variant={'outline'}
            className='col-span-full justify-between font-normal'
          >
            {(watch('fecha') as Date)?.toLocaleDateString('es-AR') ?? (
              <>
                <p>Seleccione una fecha</p>
                <ChevronDown />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <Controller
          control={control}
          name='fecha'
          rules={{
            required: {
              value: true,
              message: 'La fecha es requerida.',
            },
          }}
          render={({ field }) => (
            <PopoverContent
              className='mt-2 w-auto p-0'
              align='start'
              side='bottom'
            >
              <Calendar
                mode='single'
                selected={field.value as Date}
                onSelect={(e) => {
                  handleLocalStorage('fecha', e);
                  field.onChange(e);
                }}
                onDayClick={calendarDialog.handleOpen}
                initialFocus={false}
              />
            </PopoverContent>
          )}
        />
      </Popover>
      <Controller
        control={control}
        name='detalle.campo.id'
        render={({ field }) => (
          <SelectorFinder
            data={data.campos}
            className='col-span-6'
            onSelectValue={(id) => {
              field.onChange(id);
              setSelectedCampo(data.campos?.find((campo) => campo.id === id));
              setSelectedLotes([]);
              handleLocalStorage('campo_id', id);
            }}
            selectedValue={selectedCampo?.nombre!}
            type='Ubicación'
            placeholder='Busca un campo...'
          />
        )}
      />
      <Button
        variant={'default'}
        onClick={() => handleExternalDialog(camposDialog)}
        type='button'
        className='col-span-4'
      >
        <span className='truncate'>Nueva ubicación</span>
        <MapPinPlus />
      </Button>
      {selectedCampo && (
        <>
          <Label className='col-span-full flex items-center justify-between'>
            Seleccione los lotes a pulverizar
          </Label>
          <ul className='col-span-full flex flex-wrap items-center gap-2'>
            {(selectedCampo.Lote as Lote[]).map((lote, idx) => (
              <LoteItem
                key={`badge_${idx}-${lote.nombre}`}
                lote={lote}
                onClick={() => {
                  if (!selectedLotes.includes(lote.nombre as string))
                    setSelectedLotes((prev) => [
                      ...prev,
                      lote.nombre as string,
                    ]);
                  else
                    setSelectedLotes((prev) => [
                      ...prev.filter((selected) => selected !== lote.nombre),
                    ]);

                  handleLocalStorage('lotes', lote.nombre as string);
                }}
                customStyle={{
                  backgroundColor: selectedLotes.includes(lote.nombre as string)
                    ? '#059f0050'
                    : `${lote.color as string}50`,
                  borderColor: selectedLotes.includes(lote.nombre as string)
                    ? '#059f00'
                    : (lote.color as string),
                  cursor: 'pointer',
                }}
              />
            ))}
          </ul>
          <MapboxMap
            polygons={polygons as PolygonFeature[]}
            className='col-span-full'
            size='!h-[27dvh] md:!h-[20dvh]'
            selectedCampo={selectedCampo}
            isPulverizacionDetail
          />
        </>
      )}
      <Controller
        control={control}
        name='detalle.cultivo.id'
        rules={{
          required: { value: true, message: 'El cultivo es requerido.' },
        }}
        render={({ field }) => (
          <SelectorFinder
            data={data.cultivos}
            className='col-span-4'
            onSelectValue={(id) => {
              field.onChange(id);
              handleLocalStorage('cultivo_id', id);
            }}
            placeholder='Busca un cultivo...'
            selectedValue={
              data.cultivos.find((c) => c.id === field.value)?.nombre!
            }
            type='Cultivo'
            externalModalTrigger={
              <button
                type='button'
                onClick={() => {
                  cultivoSelector.handleOpen();
                  handleExternalDialog(cultivosDialog);
                }}
                className='cursor-pointer hover:underline'
              >
                Añadir
              </button>
            }
          />
        )}
      />
      <Controller
        control={control}
        name='detalle.tratamiento.id'
        defaultValue={watch('detalle.tratamiento.id')}
        rules={{
          required: { value: true, message: 'El tratamiento es requerido.' },
        }}
        render={({ field }) => (
          <SelectorFinder
            data={data.tratamientos}
            className='col-span-6'
            onSelectValue={(id) => {
              field.onChange(id);
              handleLocalStorage('tratamiento_id', id);
            }}
            placeholder='Busca un tipo de tratamiento...'
            selectedValue={
              data.tratamientos.find((c) => c.id === field.value)?.nombre!
            }
            type='Tratamiento'
            customAlign='end'
            externalModalTrigger={
              <button
                type='button'
                onClick={() => {
                  tratamientoSelector.handleOpen();
                  handleExternalDialog(tratamientosDialog);
                }}
                className='cursor-pointer hover:underline'
              >
                Añadir
              </button>
            }
          />
        )}
      />
      <div className='col-span-full space-y-4'>
        <div className='flex w-full items-center justify-between'>
          <Label>Productos</Label>
          <aside className='flex items-center gap-2'>
            <Button
              type='button'
              variant={'outline'}
              size={'icon'}
              onClick={addAplicacion}
            >
              <PackagePlus />
            </Button>
            <Button
              type='button'
              variant={'destructive'}
              size={'icon'}
              disabled={aplicaciones.length === 1}
              onClick={deleteAplicacion}
            >
              <PackageMinus />
            </Button>
            <Button
              type='button'
              variant='default'
              className='ml-2'
              onClick={() => handleExternalDialog(productosDialog)}
            >
              Nuevo
              <PackagePlus />
            </Button>
          </aside>
        </div>
        <ul className='max-h-36 space-y-4 overflow-auto' data-vaul-no-drag>
          {aplicaciones.map((aplicacion, index) => (
            <li key={`aplicacion-${index}`} className='grid grid-cols-10 gap-4'>
              <SelectorFinder
                data={data.productos}
                className='col-span-5'
                onSelectValue={(id) => {
                  handleChangeSelectValue(id, index);
                }}
                placeholder='Busca un producto...'
                selectedValue={
                  data.productos.find((p) => p.id === aplicacion?.producto_id)
                    ?.nombre!
                }
                type='Producto'
                customAlign='start'
                aplicaciones={aplicaciones}
              />
              <Input
                placeholder='Dosis'
                disabled={!watch('detalle.campo.id')}
                className='col-span-3 text-sm'
                onChange={(e) =>
                  handleChangeAplicacionDosis(
                    Number(e.target.value),
                    aplicacion.producto_id,
                  )
                }
                defaultValue={aplicacion?.dosis?.toString() ?? undefined}
              />
              <span className='col-span-2 self-center text-center text-sm font-semibold opacity-60'>
                {
                  SHORT_UNIDAD[
                    data.productos?.find(
                      (producto) => producto?.id === aplicacion?.producto_id,
                    )?.unidad as UNIDAD
                  ]
                }
                /ha
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Input
        {...register('detalle.observacion', {
          required: false,
          minLength: {
            value: 6,
            message: 'La observación debe tener al menos 6 caracteres',
          },
        })}
        defaultValue={storedObservacion}
        onChange={(e) => handleObservacion(e.target.value)}
        className='col-span-full text-sm'
        placeholder='Observación'
      />
      <div className='col-span-full flex flex-col items-center gap-2 md:flex-row-reverse md:items-end'>
        <Button
          disabled={isSubmitting || isSubmitSuccessful}
          type='submit'
          className={cn(
            'w-full disabled:opacity-100 md:w-fit',
            !isSubmitSuccessful
              ? 'bg-primary'
              : '!bg-green-700 text-primary-foreground dark:text-primary',
          )}
          form='form-add-pulverizacion'
        >
          {isSubmitSuccessful ? (
            <>
              Completado <Check />
            </>
          ) : !isSubmitting ? (
            <>Crear</>
          ) : (
            <>
              Procesando
              <ReloadIcon className='animate-spin' />
            </>
          )}
        </Button>
        <div className='flex w-full items-center justify-between gap-4'>
          <Button
            type='reset'
            onClick={() => {
              localStorage.removeItem('pulverizacion_temporal');
              localStorage.removeItem('aplicaciones_temporal');
              reset({});
              clearAll();
              setSelectedCampo(undefined);
              setKey(`form-${crypto.randomUUID()}`);
              reset({});
            }}
            variant={'outline'}
            className='w-full md:w-fit'
          >
            Limpiar
          </Button>
          <Button
            type='button'
            variant={'outline'}
            onClick={handleOpen}
            className='w-full md:w-fit'
          >
            Cerrar
          </Button>
        </div>
      </div>
    </form>
  );
}
