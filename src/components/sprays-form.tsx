'use client';

import {
  Check,
  ChevronDown,
  MapPinPlus,
  PackageMinus,
  PackagePlus,
} from 'lucide-react';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { Coordinate, Location, Lot } from '@/types/locations.types';
import { Dialog, useDialog } from '@/hooks/use-dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { SHORT_UNITY, UNITY } from '@/types/products.types';
import { useEffect, useState } from 'react';

import { APIError } from '@/types/error.types';
import { AllData } from '@/types/root.types';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import Cookies from 'js-cookie';
import { Crop } from '@/types/crops.types';
import { DateTime } from 'luxon';
import { Input } from './ui/input';
import { Label } from './ui/label';
import LoteItem from './lot-item';
import MapboxMap from './map';
import { PolygonFeature } from './locations-form';
import { Position } from 'geojson';
import { ReloadIcon } from '@radix-ui/react-icons';
import SelectorFinder from './selector-finder';
import { Spray } from '@/types/sprays.types';
import { Treatment } from '@/types/treatments.types';
import { UUID } from 'crypto';
import { addSpray } from '@/services/sprays.service';
import { cn } from '@/lib/utils';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useControllerApplications } from '@/hooks/use-products';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter } from 'next/navigation';

interface SprayExtended extends Spray {
  campo_id: Location['id'];
  cultivo_id: Crop['id'];
  tratamiento_id: Treatment['id'];
  observacion: Spray['detalle']['observacion'];
  lotes: Spray['detalle']['lotes'];
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

export const AddOrEditSprayForm = ({
  handleOpen,
  handleExternalDialog,
  camposDialog,
  cultivosDialog,
  productosDialog,
  tratamientosDialog,
  data,
}: Props) => {
  const { push } = useRouter();

  const storedDate =
    (
      JSON.parse(
        localStorage.getItem('pulverizacion_temporal') || '{}',
      ) as SprayExtended
    ).fecha ?? undefined;

  const storedUbicacion =
    (
      JSON.parse(
        localStorage.getItem('pulverizacion_temporal') || '{}',
      ) as SprayExtended
    ).campo_id ?? undefined;

  const storedCultivo =
    (
      JSON.parse(
        localStorage.getItem('pulverizacion_temporal') || '{}',
      ) as SprayExtended
    ).cultivo_id ?? undefined;

  const storedTratamiento =
    (
      JSON.parse(
        localStorage.getItem('pulverizacion_temporal') || '{}',
      ) as SprayExtended
    ).tratamiento_id ?? undefined;

  const storedLotes =
    (
      JSON.parse(
        localStorage.getItem('pulverizacion_temporal') || '{}',
      ) as SprayExtended
    ).lotes ?? undefined;

  const storedObservacion =
    (
      JSON.parse(
        localStorage.getItem('pulverizacion_temporal') || '{}',
      ) as SprayExtended
    ).observacion ?? undefined;

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
  } = useForm<Spray>({
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

  const [selectedCampo, setSelectedCampo] = useState<Location | undefined>(
    storedUbicacion
      ? data.campos.find((item) => item.id === storedUbicacion)
      : undefined,
  );
  const [selectedLotes, setSelectedLotes] = useState<string[]>(
    storedLotes ?? [],
  );

  const [polygons, setPolygons] = useState<PolygonFeature[]>();

  const [selectedCultivoColor, setSelectedCultivoColor] = useState<
    string | null
  >(
    storedCultivo
      ? (data.cultivos.find((c) => c.id === storedCultivo)?.color ?? '#000000')
      : '#000000',
  );

  useEffect(() => {
    if (selectedCampo)
      setPolygons(
        (selectedCampo?.Lote as Lot[]).map((l) => {
          const points = l.Coordinada as Coordinate[];
          const groupedByLoteId = points.reduce(
            (acc, coord) => {
              const { id, lng, lat, lote_id } = coord as Required<Coordinate>;
              if (!acc[lote_id]) acc[lote_id] = [];

              acc[lote_id].push([lng, lat, id as unknown as number]);
              return acc;
            },
            {} as Record<string, Position[]>,
          );

          const loteIsPulverizado = data.pulverizaciones
            .filter((p) => p.detalle.campo_id === selectedCampo.id)
            ?.find((p) => p.detalle.lotes.includes(l.nombre as string));

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
              color:
                loteIsPulverizado && selectedLotes.includes(l.nombre as string)
                  ? selectedCultivoColor
                  : loteIsPulverizado
                    ? loteIsPulverizado.detalle.cultivo?.color
                    : selectedLotes.includes(l.nombre as string)
                      ? selectedCultivoColor
                      : '#000000',
              opacity: selectedLotes.includes(l.nombre as string) ? 1 : 0.5,
            },
          } as PolygonFeature;
        }),
      );
  }, [selectedCampo, selectedLotes, selectedCultivoColor]);

  const {
    aplicaciones,
    addAplicacion,
    areEmptySelectedProducts,
    deleteAplicacion,
    handleChangeAplicacionDosis,
    handleChangeSelectValue,
    handleUpdateAplicacionesOnLocalStorage,
    clearAll,
  } = useControllerApplications();

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<
    boolean | undefined
  >(undefined);

  const onInvalidSubmit = (errors: FieldErrors<Spray>) => {
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
  const onSubmit = async (values: Spray) => {
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
      const PAYLOAD: Spray = {
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

      await addSpray(PAYLOAD, access_token);
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
    key: keyof SprayExtended,
    value: SprayExtended[keyof SprayExtended],
  ) => {
    const pulverizacionTemporal = localStorage.getItem(
      'pulverizacion_temporal',
    );
    if (!pulverizacionTemporal)
      localStorage.setItem(
        'pulverizacion_temporal',
        JSON.stringify({
          [key]: key === 'lotes' ? [value] : value,
        } as Partial<Spray>),
      );
    else {
      const pulverizacion: SprayExtended = JSON.parse(pulverizacionTemporal);
      const haveStoredLotes = pulverizacion.lotes ? true : false;

      let updated: SprayExtended = {
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
      className='grid max-h-[86dvh] grid-cols-10 gap-4 overflow-y-auto'
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
            selectedValue={selectedCampo?.nombre as string}
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
            {(selectedCampo.Lote as Lot[]).map((lote, idx) => (
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
                    ? '#059f00'
                    : `#b0b0b0`,
                  borderColor: selectedLotes.includes(lote.nombre as string)
                    ? '#059f00'
                    : '#a2a2a2',
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
              setSelectedCultivoColor(
                data.cultivos.find((c) => c.id === id)?.color ?? '#000000',
              );
            }}
            placeholder='Busca un cultivo...'
            selectedValue={
              data.cultivos.find((c) => c.id === field.value)?.nombre as string
            }
            selectedColor={selectedCultivoColor}
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
              data.tratamientos.find((c) => c.id === field.value)
                ?.nombre as string
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
                    ?.nombre as string
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
                  SHORT_UNITY[
                    data.productos?.find(
                      (producto) => producto?.id === aplicacion?.producto_id,
                    )?.unidad as UNITY
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
};
