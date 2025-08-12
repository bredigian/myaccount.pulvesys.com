import { FieldErrors, useForm } from 'react-hook-form';
import { addCultivo, editCultivo } from '@/services/cultivos.service';

import { APIError } from '@/types/error.types';
import { Button } from './ui/button';
import { Check } from 'lucide-react';
import ColorPicker from './color-picker';
import Cookies from 'js-cookie';
import { Cultivo } from '@/types/cultivos.types';
import { Input } from './ui/input';
import { ReloadIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddOrEditCultivoForm({
  isEdit,
  data,
  handleOpen,
}: {
  isEdit?: boolean;
  data?: Cultivo;
  handleOpen: () => void;
}) {
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<Cultivo>({
    defaultValues: isEdit
      ? { nombre: data?.nombre, color: data?.color ?? '#000000' }
      : undefined,
  });

  const [color, setColor] = useState<string>(data?.color ?? '#000000');

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<
    boolean | undefined
  >(undefined);

  const onInvalidSubmit = (errors: FieldErrors<Cultivo>) => {
    if (errors.nombre)
      toast.error(errors.nombre.message, { position: 'top-center' });
  };
  const onSubmit = async (values: Cultivo) => {
    try {
      const PAYLOAD: Cultivo = {
        ...values,
        id: data?.id,
        color,
      };

      const access_token = Cookies.get('access_token');
      if (!access_token) {
        toast.error('La sesión ha expirado', { position: 'top-center' });
        push('/');

        return;
      }

      if (!isEdit) await addCultivo(PAYLOAD, access_token);
      else await editCultivo(PAYLOAD, access_token);
      await revalidate('cultivos');
      await revalidate('historial');

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
      className='grid grid-cols-10 gap-4 px-4 pb-4 md:px-0 md:pb-0'
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
        className='col-span-8 text-sm md:col-span-9'
      />
      <div className='col-span-2 md:col-span-1'>
        <ColorPicker color={color} onChange={(value) => setColor(value)} />
      </div>
      <div className='col-span-full flex flex-col items-center gap-2 md:flex-row-reverse md:items-end'>
        <Button
          disabled={
            (!isDirty && color === data?.color) ||
            isSubmitting ||
            isSubmitSuccessful
          }
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
}
