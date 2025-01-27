'use client';

import {
  ArrowDown,
  Check,
  ChevronDown,
  PackageMinus,
  PackagePlus,
} from 'lucide-react';
import { Campo, Lote } from '@/types/campos.types';
import { Controller, useForm } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Producto, UNIDAD } from '@/types/productos.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Cultivo } from '@/types/cultivos.types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Map from './map';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Tratamiento } from '@/types/tratamientos.types';
import { UUID } from 'crypto';
import { addPulverizacion } from '@/services/pulverizaciones.service';
import { cn } from '@/lib/utils';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useControllerAplicaciones } from '@/hooks/use-productos';
import { useState } from 'react';

interface Props {
  campos: Campo[];
  productos: Producto[];
  cultivos: Cultivo[];
  tratamientos: Tratamiento[];
}

export default function AddOrEditPulverizacionForm({
  campos,
  productos,
  cultivos,
  tratamientos,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm<Pulverizacion>({});

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<
    boolean | undefined
  >(undefined);

  const onInvalidSubmit = (errors) => {
    if (errors?.fecha)
      toast.error(errors.fecha.message, {
        position: 'top-center',
      });
    else if (errors?.detalle) {
      if (errors?.detalle?.hectareas)
        toast.error(errors?.detalle?.hectareas?.message, {
          position: 'top-center',
        });
      else if (errors?.detalle?.cultivo?.id)
        toast.error(errors.detalle.cultivo.id.message, {
          position: 'top-center',
        });
      else if (errors?.detalle?.tratamiento?.id)
        toast.error(errors.detalle.tratamiento.id.message, {
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
          hectareas: Number(values.detalle.hectareas),
          campo_id: values.detalle.campo?.id as UUID,
          cultivo_id: values.detalle.cultivo?.id as UUID,
          tratamiento_id: values.detalle.tratamiento?.id as UUID,
          lotes: selectedLotes,
        },
        productos: aplicaciones,
      };
      await addPulverizacion(PAYLOAD);
      await revalidate('pulverizaciones');

      setIsSubmitSuccessful(true);
      toast.success('Pulverzación creada con éxito.');
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  const [selectedCampo, setSelectedCampo] = useState<Campo>();
  const [selectedLotes, setSelectedLotes] = useState<string[]>([]);

  const {
    aplicaciones,
    addAplicacion,
    areEmptySelectedProducts,
    deleteAplicacion,
    handleChangeAplicacionDosis,
    handleChangeSelectValue,
  } = useControllerAplicaciones();

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
      className='grid grid-cols-10 gap-4 px-4'
    >
      <Popover>
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
                onSelect={field.onChange}
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
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              setSelectedCampo(campos.find((campo) => campo.id === value));
            }}
            {...field}
          >
            <SelectTrigger className='col-span-6'>
              <SelectValue placeholder='Campo' />
            </SelectTrigger>
            <SelectContent className='col-span-6'>
              {campos.map((campo) => {
                return (
                  <SelectItem key={campo.id} value={campo.id as string}>
                    {campo.nombre} ({campo.hectareas}ha)
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      />
      <Input
        {...register('detalle.hectareas', {
          required: {
            value: true,
            message: 'El nro. de hectáreas es necesario.',
          },
          max: {
            value: selectedCampo?.hectareas ?? 999999,
            message: 'El nro. excede la superficie del campo.',
          },
        })}
        placeholder='Hectáreas'
        className='col-span-4 text-sm'
        type='number'
        disabled={!selectedCampo}
      />
      {selectedCampo && (
        <>
          <Label className='col-span-full flex items-center justify-between'>
            <p>Seleccione los lotes a pulverizar</p>
            <ArrowDown size={20} />
          </Label>
          <Map
            lotes={selectedCampo.Lote as Lote[]}
            className='col-span-8'
            size='!h-[20vh]'
            customCenter
            customZoom={14}
          />
          <ul className='col-span-2 space-y-2'>
            {(selectedCampo.Lote as Lote[]).map((lote) => (
              <li
                key={`badge-${lote.nombre}`}
                style={{
                  backgroundColor: selectedLotes.includes(lote.nombre as string)
                    ? '#059f0050'
                    : `${lote.color as string}50`,
                  borderColor: selectedLotes.includes(lote.nombre as string)
                    ? '#059f00'
                    : (lote.color as string),
                }}
                className='rounded-md border-2 px-3 py-1 text-center text-xs font-semibold hover:cursor-pointer'
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
                }}
              >
                {lote.nombre}
              </li>
            ))}
          </ul>
        </>
      )}
      <Controller
        control={control}
        name='detalle.cultivo.id'
        rules={{
          required: { value: true, message: 'El cultivo es requerido.' },
        }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} {...field}>
            <SelectTrigger className='col-span-4'>
              <SelectValue placeholder='Cultivo' />
            </SelectTrigger>
            <SelectContent className='col-span-4'>
              {cultivos.map((cultivo) => {
                return (
                  <SelectItem key={cultivo.id} value={cultivo.id as string}>
                    {cultivo.nombre}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      />
      <Controller
        control={control}
        name='detalle.tratamiento.id'
        rules={{
          required: { value: true, message: 'El tratamiento es requerido.' },
        }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} {...field}>
            <SelectTrigger className='col-span-6'>
              <SelectValue placeholder='Tipo de tratamiento' />
            </SelectTrigger>
            <SelectContent className='col-span-6'>
              {tratamientos.map((tratamiento) => {
                return (
                  <SelectItem
                    key={tratamiento.id}
                    value={tratamiento.id as string}
                  >
                    {tratamiento.nombre}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
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
          </aside>
        </div>
        <ul className='max-h-48 space-y-4 overflow-auto'>
          {aplicaciones.map((aplicacion, index) => (
            <li key={`aplicacion-${index}`} className='grid grid-cols-10 gap-4'>
              <Select
                onValueChange={(value) => handleChangeSelectValue(value, index)}
              >
                <SelectTrigger className='col-span-5'>
                  <SelectValue placeholder='Producto' />
                </SelectTrigger>
                <SelectContent className='col-span-5'>
                  {productos.map((producto) => {
                    return (
                      <SelectItem
                        key={producto.id}
                        value={producto.id as string}
                      >
                        {producto.nombre}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Input
                placeholder='Dosis'
                className='col-span-3 text-sm'
                onChange={(e) =>
                  handleChangeAplicacionDosis(
                    Number(e.target.value),
                    aplicacion.producto_id,
                  )
                }
              />
              <span className='col-span-2 self-center text-sm font-semibold opacity-60'>
                {productos.find(
                  (producto) => producto.id === aplicacion.producto_id,
                )?.unidad === UNIDAD.LITROS
                  ? 'L/Ha'
                  : 'g/Ha'}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Button
        disabled={isSubmitting || isSubmitSuccessful}
        type='submit'
        className={cn('col-span-full', isSubmitSuccessful && 'bg-green-700')}
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
    </form>
  );
}
