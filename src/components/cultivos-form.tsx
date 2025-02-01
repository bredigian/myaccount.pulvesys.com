import { addCultivo, editCultivo } from '@/services/cultivos.service';

import { Button } from './ui/button';
import { Check } from 'lucide-react';
import Cookies from 'js-cookie';
import { Cultivo } from '@/types/cultivos.types';
import { Input } from './ui/input';
import { ReloadIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useDataStore } from '@/store/data.store';
import { useForm } from 'react-hook-form';
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
    formState: { isSubmitting },
  } = useForm<Cultivo>({
    defaultValues: isEdit ? { nombre: data?.nombre } : undefined,
  });

  const { getCultivos } = useDataStore();

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<
    boolean | undefined
  >(undefined);

  const onInvalidSubmit = (errors) => {
    if (errors.nombre)
      toast.error(errors.nombre.message, { className: 'mb-64' });
  };
  const onSubmit = async (values: Cultivo) => {
    try {
      const PAYLOAD: Cultivo = {
        ...values,
        id: data?.id,
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
      await getCultivos(access_token);

      setIsSubmitSuccessful(true);
      setTimeout(() => handleOpen(), 1000);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
      className='space-y-4 px-4 pb-4'
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
      <div className='flex flex-col items-center gap-2'>
        <Button
          disabled={isSubmitting || isSubmitSuccessful}
          type='submit'
          className={cn(
            'w-full disabled:opacity-100',
            !isSubmitSuccessful ? 'bg-primary' : '!bg-green-700',
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
          className='w-full'
        >
          Cerrar
        </Button>
      </div>
    </form>
  );
}
