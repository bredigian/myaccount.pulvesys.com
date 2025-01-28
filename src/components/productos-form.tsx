import { Controller, useForm } from 'react-hook-form';
import { Producto, UNIDAD } from '@/types/productos.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { addProducto, editProducto } from '@/services/productos.service';

import { Button } from './ui/button';
import { Check } from 'lucide-react';
import { Input } from './ui/input';
import { ReloadIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useDataStore } from '@/store/data.store';
import { useState } from 'react';

const UNIDADES = Object.entries(UNIDAD).map(([key, value]) => ({
  label: value,
  value: key,
}));

export default function AddOrEditProductoForm({
  isEdit,
  data,
  handleOpen,
}: {
  isEdit?: boolean;
  data?: Producto;
  handleOpen: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Producto>({
    defaultValues: isEdit
      ? { nombre: data?.nombre, cantidad: data?.cantidad, unidad: data?.unidad }
      : undefined,
  });

  const { getProductos } = useDataStore();

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<
    boolean | undefined
  >(undefined);

  const onInvalidSubmit = (errors) => {
    if (errors.nombre)
      toast.error(errors.nombre.message, { className: 'mb-80' });
    else if (errors.cantidad)
      toast.error(errors.cantidad.message, { className: 'mb-80' });
    else if (errors.unidad)
      toast.error(errors.unidad.message, { className: 'mb-80' });
  };
  const onSubmit = async (values: Producto) => {
    try {
      const PAYLOAD: Producto = {
        ...values,
        id: data?.id,
        cantidad: parseInt(values.cantidad.toString()),
        unidad: values.unidad.toUpperCase() as UNIDAD,
      };
      if (!isEdit) await addProducto(PAYLOAD);
      else await editProducto(PAYLOAD);
      await revalidate('productos');
      await getProductos();

      setIsSubmitSuccessful(true);
      setTimeout(() => handleOpen(), 1000);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
      className='space-y-4 px-4'
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
      <div className='grid grid-cols-8 gap-4'>
        <Input
          {...register('cantidad', {
            required: { value: true, message: 'La cantidad es requerida.' },
            min: { value: 1, message: 'El valor mínimo es 1' },
          })}
          className='col-span-5 text-sm'
          placeholder='Cantidad'
          type='number'
        />
        <Controller
          control={control}
          name='unidad'
          rules={{
            required: { value: true, message: 'La unidad es requerida' },
          }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={data?.unidad}>
              <SelectTrigger className='col-span-3 text-sm'>
                <SelectValue placeholder='Unidad' />
              </SelectTrigger>
              <SelectContent className='col-span-3' align='start'>
                {UNIDADES.map((unidad) => (
                  <SelectItem key={unidad.label} value={unidad.value}>
                    {unidad.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <Button
        disabled={isSubmitting || isSubmitSuccessful}
        type='submit'
        className={cn(
          'w-full disabled:opacity-100',
          isSubmitSuccessful && 'bg-green-700',
        )}
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
