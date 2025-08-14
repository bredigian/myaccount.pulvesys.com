import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { Product, UNITY } from '@/types/products.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { addProduct, editProduct } from '@/services/products.service';

import { APIError } from '@/types/error.types';
import { Button } from './ui/button';
import { Check } from 'lucide-react';
import Cookies from 'js-cookie';
import { Input } from './ui/input';
import { ReloadIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const UNITS = Object.entries(UNITY).map(([key, value]) => ({
  label: value,
  value: key,
}));

export const AddOrEditProductForm = ({
  isEdit,
  data,
  handleOpen,
}: {
  isEdit?: boolean;
  data?: Product;
  handleOpen: () => void;
}) => {
  const { push } = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<Product>({
    defaultValues: isEdit
      ? { nombre: data?.nombre, unidad: data?.unidad }
      : undefined,
  });

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<
    boolean | undefined
  >(undefined);

  const onInvalidSubmit = (errors: FieldErrors<Product>) => {
    if (errors.nombre)
      toast.error(errors.nombre.message, { position: 'top-center' });
    else if (errors.unidad)
      toast.error(errors.unidad.message, { position: 'top-center' });
  };
  const onSubmit = async (values: Product) => {
    try {
      const PAYLOAD: Product = {
        ...values,
        id: data?.id,
        unidad: values.unidad.toUpperCase() as UNITY,
      };

      const access_token = Cookies.get('access_token');
      if (!access_token) {
        toast.error('La sesión ha expirado', { position: 'top-center' });
        push('/');

        return;
      }

      if (!isEdit) await addProduct(PAYLOAD, access_token);
      else await editProduct(PAYLOAD, access_token);
      await revalidate('productos');

      setIsSubmitSuccessful(true);
      setTimeout(() => handleOpen(), 1000);
    } catch (error) {
      const { statusCode, message } = error as APIError;

      toast.error(message, { position: 'top-center' });
      const unauthorized = statusCode === 401 || statusCode === 403;
      if (unauthorized) setTimeout(() => push('/'), 250);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        handleSubmit(onSubmit, onInvalidSubmit)(e);
      }}
      className='grid grid-cols-7 gap-4 px-4 pb-4 md:px-0 md:pb-0'
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
        className='col-span-4 text-sm'
      />
      <Controller
        control={control}
        name='unidad'
        rules={{
          required: { value: true, message: 'La unidad es requerida' },
        }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={data?.unidad}>
            <SelectTrigger className='col-span-3 !mt-0 text-sm'>
              <SelectValue placeholder='Unidad' />
            </SelectTrigger>
            <SelectContent className='col-span-3' align='start'>
              {UNITS.map((unidad) => (
                <SelectItem key={unidad.label} value={unidad.value}>
                  {unidad.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <div className='col-span-full flex flex-col items-center gap-2 md:flex-row-reverse md:items-end'>
        <Button
          disabled={!isDirty || isSubmitting || isSubmitSuccessful}
          type='submit'
          className={cn(
            'w-full md:w-fit',
            isDirty ? 'disabled:opacity-100' : 'disabled:opacity-75',
            !isSubmitSuccessful
              ? 'bg-primary'
              : '!bg-green-700 text-primary-foreground dark:text-primary',
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
};
