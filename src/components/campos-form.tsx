'use client';

import { Campo, Coordinada, Lote } from '@/types/campos.types';
import { Check, Cloud, Eraser, Layers, MapPinPlusInside } from 'lucide-react';
import { FieldErrors, useForm } from 'react-hook-form';
import { addCampo, editCampo } from '@/services/campos.service';
import { area, convertArea } from '@turf/turf';
import { useEffect, useState } from 'react';

import { APIError } from '@/types/error.types';
import { Button } from './ui/button';
import ColorPicker from './color-picker';
import Cookies from 'js-cookie';
import { FeatureCollection } from 'geojson';
import { Input } from './ui/input';
import { Label } from './ui/label';
import LoteItem from './lote-item';
import MapboxMap from './map';
import { ReloadIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter } from 'next/navigation';

export default function AddOrEditCampoForm({
  isEdit,
  data,
  handleOpen,
}: {
  isEdit?: boolean;
  data?: Campo;
  handleOpen: () => void;
}) {
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Campo>({
    defaultValues: isEdit ? { nombre: data?.nombre } : undefined,
  });

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<
    boolean | undefined
  >(undefined);

  const onInvalidSubmit = (errors: FieldErrors<Campo>) => {
    if (errors.nombre)
      toast.error(errors.nombre.message, {
        position: 'top-center',
      });
  };
  const onSubmit = async (values: Campo) => {
    try {
      if (lotes.length === 0) {
        toast.error('No se añadieron lotes', {
          position: 'top-center',
        });
        return;
      }
      const PAYLOAD: Campo = {
        ...values,
        id: data?.id,
        Lote: lotes,
      };

      const access_token = Cookies.get('access_token');
      if (!access_token) {
        toast.error('La sesión ha expirado', { position: 'top-center' });
        push('/');

        return;
      }

      if (!isEdit) await addCampo(PAYLOAD, access_token);
      else await editCampo(PAYLOAD, access_token);

      setIsSubmitSuccessful(true);
      setTimeout(() => handleOpen(), 1000);

      await revalidate('campos');
    } catch (error) {
      const { statusCode, message } = error as APIError;

      toast.error(message, { position: 'top-center' });
      const unauthorized = statusCode === 401 || statusCode === 403;
      if (unauthorized) setTimeout(() => push('/'), 250);
    }
  };

  const [enable, setEnable] = useState(false);

  const [lotes, setLotes] = useState<Lote[]>(
    !isEdit ? [] : (data?.Lote as Lote[]),
  );
  const addLote = (lote: Lote) => setLotes((prev) => [...prev, lote]);

  const [lote, setLote] = useState<Lote>({
    nombre: '',
    hectareas: 0,
    zona: [],
    color: '#000000',
  });
  const handleLote = (point: Coordinada) =>
    setLote((prev) => {
      if (prev.zona.length === 0) {
        return { ...prev, zona: [point, point] };
      }
      const newArea = [...prev.zona];
      newArea.splice(newArea.length - 1, 0, point);
      return { ...prev, zona: newArea };
    });

  const handleLoteName = (value: string) => {
    setLote((prev) => ({ ...prev, nombre: value }));
  };

  const handleLoteHectareas = (value: number) => {
    setLote((prev) => ({ ...prev, hectareas: value }));
  };

  const handleLoteColor = useDebouncedCallback((value: string) => {
    setLote((prev) => ({ ...prev, color: value }));
  }, 300);

  useEffect(() => {
    if (isEdit) setLotes(data?.Lote as Lote[]);
  }, [data]);

  useEffect(() => {
    const actualGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: lote?.zona
              ? [lote?.zona?.map((c) => [c.lng, c.lat])]
              : [],
          },
          properties: {
            color: lote?.color,
            opacity: 0.75,
          },
        },
      ],
    };

    const selectedArea = convertArea(area(actualGeoJSON), 'meters', 'hectares');
    if (selectedArea !== 0)
      handleLoteHectareas(Number(selectedArea.toFixed(2)));
  }, [lote.zona]);

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        handleSubmit(onSubmit, onInvalidSubmit)(e);
      }}
      className='space-y-4 px-4 pb-4 md:px-0 md:pb-0'
      id='form-add-campos'
    >
      <Input
        {...register('nombre', {
          required: { value: true, message: 'El nombre es requerido.' },
          minLength: {
            value: 4,
            message: 'Debe contener al menos 4 caracteres.',
          },
        })}
        placeholder='Nombre'
        className='text-sm'
      />

      <div className='flex h-[60dvh] w-full flex-col gap-4 overflow-y-auto md:justify-between'>
        <div className='flex items-center justify-between'>
          <Label>Ubicación</Label>
          <aside className='flex items-center gap-2'>
            <Button
              variant={'outline'}
              onClick={() => {
                if (!enable) setEnable(true);
                else {
                  if (!lote.nombre) {
                    toast.error('El nombre de lote es requerido', {
                      position: 'top-center',
                    });

                    return;
                  } else if (!lote.hectareas || lote.hectareas === 0) {
                    toast.error('Las hectáreas son requeridas', {
                      position: 'top-center',
                    });

                    return;
                  }

                  let error = false;
                  for (const l of lotes) {
                    if (
                      l.nombre?.toLowerCase() === lote?.nombre?.toLowerCase()
                    ) {
                      toast.error(
                        'No puede haber dos lotes con el mismo nombre',
                        { position: 'top-center' },
                      );
                      error = true;

                      break;
                    }
                  }
                  if (error) return;

                  addLote(lote as Lote);
                  setLote({
                    nombre: '',
                    hectareas: 0,
                    zona: [],
                    color: lote.color as string,
                  });
                  setEnable(false);
                }
              }}
              type='button'
            >
              {!enable ? (
                <>
                  Agregar lote <MapPinPlusInside />
                </>
              ) : (
                <>
                  Finalizar <Check />
                </>
              )}
            </Button>
            <Button
              variant={'destructive'}
              size={'icon'}
              onClick={() =>
                setLote((prev) => ({
                  ...prev,
                  zona: [],
                  hectareas: 0,
                }))
              }
              disabled={!enable}
              type='button'
            >
              <Eraser />
            </Button>
          </aside>
        </div>
        <div className='grid grid-cols-9 gap-4'>
          <Input
            placeholder='Nombre del lote'
            className='col-span-4 text-sm'
            disabled={!lote.nombre && !enable}
            onChange={(e) => handleLoteName(e.target.value)}
            value={lote.nombre as string}
          />
          <div className='group relative col-span-3 flex items-center'>
            <Layers className='absolute pl-2 opacity-60 group-focus-within:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100' />
            <Input
              placeholder='Hectáreas'
              className='peer col-span-3 pl-8 text-sm'
              disabled={!lote.hectareas && !enable}
              type='number'
              onChange={(e) => handleLoteHectareas(Number(e.target.value))}
              value={lote.hectareas?.toString()}
            />
          </div>
          <ColorPicker
            color={lote.color as string}
            onChange={(color) => handleLoteColor(color)}
          />
        </div>
        <MapboxMap
          key={data?.Lote?.length}
          size='!grow'
          enable={enable}
          handleLote={handleLote as () => void}
          actualLote={lote}
          lotesCampo={lotes}
          lotesPulverizados={lotes}
        />
        <ul
          key={`lotes-list-${data?.Lote?.length}`}
          className='relative flex max-h-[244px] flex-wrap items-end gap-2'
        >
          {lotes?.length === 0 ? (
            <li className='rounded-md border-2 border-gray-200 bg-gray-50/50 px-3 py-1 text-xs font-semibold'>
              Sin lotes
            </li>
          ) : (
            lotes?.map((lote, index) => (
              <LoteItem
                key={`badge-${lote.nombre}-${index}`}
                lote={lote}
                showButtonClear
                deleteLote={() =>
                  setLotes((prev) =>
                    prev.filter((l) => l.nombre !== lote.nombre),
                  )
                }
                isEditting={isEdit}
                storedLotesQuantity={
                  lotes.filter((l) => (l.id ? 1 : 0))?.length
                }
              />
            ))
          )}
        </ul>
      </div>
      {isEdit && (
        <div className='flex items-center gap-2'>
          <div className='w-fit rounded-t-md border-2 border-primary bg-green-600 p-1 dark:border-primary-foreground'>
            <Cloud size={14} />
          </div>
          <p className='text-sm italic'>* Almacenado en base de datos</p>
        </div>
      )}
      <div className='flex flex-col items-center gap-2 md:flex-row-reverse md:items-end'>
        <Button
          disabled={isSubmitting || isSubmitSuccessful || enable}
          type='submit'
          className={cn(
            'w-full md:w-fit',
            !enable && 'disabled:opacity-100',
            !isSubmitSuccessful
              ? 'bg-primary'
              : '!bg-green-700 text-primary-foreground dark:text-primary',
          )}
          form='form-add-campos'
        >
          {isSubmitSuccessful ? (
            <>
              Completado <Check />
            </>
          ) : !isSubmitting ? (
            !isEdit ? (
              'Agregar'
            ) : (
              'Modificar'
            )
          ) : (
            <>
              Procesando
              <ReloadIcon className='animate-spin' />
            </>
          )}
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
    </form>
  );
}
