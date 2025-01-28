import { Campo, Coordinada, Lote } from '@/types/campos.types';
import { Check, Eraser, MapPinPlusInside } from 'lucide-react';
import { addCampo, editCampo } from '@/services/campos.service';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LatLngExpression } from 'leaflet';
import Map from './map';
import { ReloadIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useDataStore } from '@/store/data.store';
import { useDebouncedCallback } from 'use-debounce';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function AddOrEditCampoForm({
  isEdit,
  data,
  handleOpen,
}: {
  isEdit?: boolean;
  data?: Campo;
  handleOpen: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Campo>({
    defaultValues: isEdit
      ? { nombre: data?.nombre, hectareas: data?.hectareas }
      : undefined,
  });

  const { getCampos } = useDataStore();

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<
    boolean | undefined
  >(undefined);

  const onInvalidSubmit = (errors) => {
    if (errors.nombre)
      toast.error(errors.nombre.message, {
        className: `mt-6`,
        position: 'top-center',
      });
    else if (errors.hectareas)
      toast.error(errors.hectareas.message, {
        className: `mt-6`,
        position: 'top-center',
      });
  };
  const onSubmit = async (values: Campo) => {
    try {
      if (lotes.length === 0) {
        toast.error('No se añadieron lotes', {
          className: 'mt-6',
          position: 'top-center',
        });
        return;
      }
      const PAYLOAD: Campo = {
        ...values,
        id: data?.id,
        hectareas: parseInt(values.hectareas.toString()),
        Lote: lotes,
      };
      if (!isEdit) await addCampo(PAYLOAD);
      else await editCampo(PAYLOAD);
      await revalidate('campos');
      await getCampos();

      setIsSubmitSuccessful(true);
      setTimeout(() => handleOpen(), 1000);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  const [enable, setEnable] = useState(false);

  const [lotes, setLotes] = useState<Lote[]>(
    !isEdit ? [] : (data?.Lote as Lote[]),
  );
  const addLote = (lote: Lote) => setLotes((prev) => [...prev, lote]);

  const [lote, setLote] = useState<Lote>({
    nombre: '',
    zona: [],
    color: '#000000',
  });
  const handleLote = (point: Coordinada) => {
    console.log(point);
    setLote((prev) => ({ ...prev, zona: [...prev.zona, point] }));
  };

  const handleLoteName = (value: string) => {
    setLote((prev) => ({ ...prev, nombre: value }));
  };

  const handleLoteColor = useDebouncedCallback((value: string) => {
    setLote((prev) => ({ ...prev, color: value }));
  }, 300);

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        handleSubmit(onSubmit, onInvalidSubmit)(e);
      }}
      className='space-y-4 px-4'
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
      <Input
        {...register('hectareas', {
          required: { value: true, message: 'Las hectáreas son requeridas.' },
          min: {
            value: 1,
            message: 'El valor mínimo es 1.',
          },
        })}
        placeholder='Hectáreas'
        className='text-sm'
      />
      <div className='w-full space-y-4'>
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
                      className: `mt-6`,
                      position: 'top-center',
                    });
                    return;
                  }
                  console.log(lote);
                  addLote(lote as Lote);
                  setLote({
                    nombre: '',
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
                }))
              }
              disabled={!enable}
              type='button'
            >
              <Eraser />
            </Button>
          </aside>
        </div>
        <Map
          lotes={lotes}
          actualLote={lote}
          handleLote={handleLote as () => void}
          enable={enable}
          centerByEdit={
            isEdit
              ? ([
                  data?.Lote?.[0]?.Coordinada?.[0]?.lat,
                  data?.Lote?.[0]?.Coordinada?.[0]?.lng,
                ] as LatLngExpression)
              : undefined
          }
        />
        <ul className='flex items-center gap-2'>
          {lotes.length === 0 ? (
            <li className='rounded-md border-2 border-gray-200 bg-gray-50/50 px-3 py-1 text-xs font-semibold'>
              Sin lotes
            </li>
          ) : (
            lotes?.map((lote) => (
              <li
                key={`badge-${lote.nombre}`}
                style={{
                  backgroundColor: `${lote.color as string}50`,
                  borderColor: lote.color as string,
                }}
                className='rounded-md border-2 px-3 py-1 text-xs font-semibold'
              >
                {lote.nombre}
              </li>
            ))
          )}
        </ul>
        <div className='grid grid-cols-6 gap-4'>
          <Input
            placeholder='Nombre del lote'
            className='col-span-4 text-sm'
            disabled={!lote.nombre && !enable}
            onChange={(e) => handleLoteName(e.target.value)}
            value={lote.nombre as string}
          />
          <Input
            type='color'
            placeholder='color'
            className='col-span-2'
            onChange={(e) => handleLoteColor(e.target.value)}
            value={lote.color as string}
          />
        </div>
      </div>
      <Button
        disabled={isSubmitting || isSubmitSuccessful}
        type='submit'
        className={cn(
          'w-full disabled:opacity-100',
          isSubmitSuccessful && 'bg-green-700',
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
    </form>
  );
}
