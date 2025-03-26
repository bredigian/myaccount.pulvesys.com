import { Check, Eye, EyeClosed } from 'lucide-react';
import { Controller, FieldErrors, useForm } from 'react-hook-form';

import { APIError } from '@/types/error.types';
import { Button } from './ui/button';
import Cookies from 'js-cookie';
import { Input } from './ui/input';
import PhoneNumberInput from './phone-number-input';
import { ReloadIcon } from '@radix-ui/react-icons';
import { UsuarioToSignup } from '@/types/usuario.types';
import { addUsuario } from '@/services/usuarios.service';
import { cn } from '@/lib/utils';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddOrEditUsuarioForm({
  isEdit,
  data,
  handleOpen,
}: {
  isEdit?: boolean;
  data?: UsuarioToSignup;
  handleOpen: () => void;
}) {
  const { push } = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    watch,
  } = useForm<UsuarioToSignup>({
    defaultValues: isEdit ? { nombre: data?.nombre } : { rol: 'INDIVIDUAL' },
  });

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<
    boolean | undefined
  >(undefined);

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const password = watch('contrasena');
  const confirmPassword = watch('confirmar_contrasena');
  const hasErrorConfirmPassword = !confirmPassword
    ? false
    : confirmPassword !== password;

  const onInvalidSubmit = async (errors: FieldErrors<UsuarioToSignup>) => {
    if (errors?.nombre)
      toast.error(errors.nombre?.message, { position: 'top-center' });
    else if (errors?.apellido)
      toast.error(errors.apellido?.message, { position: 'top-center' });
    else if (errors?.nombre_usuario)
      toast.error(errors.nombre_usuario?.message, { position: 'top-center' });
    else if (errors?.email)
      toast.error(errors.email?.message, { position: 'top-center' });
    else if (errors?.nro_telefono)
      toast.error(errors.nro_telefono?.message, { position: 'top-center' });
    else if (errors?.contrasena)
      toast.error(errors.contrasena?.message, { position: 'top-center' });
    else if (errors?.confirmar_contrasena)
      toast.error(errors.confirmar_contrasena?.message, {
        position: 'top-center',
      });
    else if (errors?.rol)
      toast.error(errors.rol?.message, { position: 'top-center' });
  };
  const onSubmit = async (values: UsuarioToSignup) => {
    try {
      const PAYLOAD: UsuarioToSignup = {
        ...values,
        confirmar_contrasena: undefined,
      };

      const access_token = Cookies.get('access_token');
      if (!access_token) {
        toast.error('La sesión ha expirado', { position: 'top-center' });
        push('/');

        return;
      }

      if (!isEdit) await addUsuario(PAYLOAD, access_token);
      else
        throw new Error(
          'La modificación de usuarios todavia no está habilitada.',
        );
      //   else await editCultivo(PAYLOAD, access_token);
      await revalidate('usuarios');

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
      className='grid h-full w-full grid-cols-8 gap-4 px-4 pb-4 md:px-0 md:pb-0'
      onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
    >
      <Input
        {...register('nombre', {
          required: {
            value: true,
            message: 'El nombre es requerido.',
          },
          minLength: { value: 3, message: 'Debe tener al menos 3 caracteres.' },
        })}
        id='nombre_input'
        placeholder='Nombre'
        className='col-span-full text-sm md:col-span-4 lg:text-base'
        type='text'
      />
      <Input
        {...register('apellido', {
          required: {
            value: true,
            message: 'El apellido es requerido.',
          },
          minLength: { value: 3, message: 'Debe tener al menos 3 caracteres.' },
        })}
        placeholder='Apellido'
        className='col-span-full text-sm md:col-span-4 lg:text-base'
        type='text'
      />

      <Input
        {...register('nombre_usuario', {
          required: {
            value: true,
            message: 'El nombre de usuario es requerido.',
          },
          minLength: { value: 6, message: 'Debe tener al menos 6 caracteres.' },
        })}
        placeholder='Usuario'
        className='col-span-full text-sm lg:text-base'
        type='text'
      />
      <Input
        {...register('email', {
          required: {
            value: true,
            message: 'El correo es requerido.',
          },
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'El correo no es válido.',
          },
        })}
        placeholder='Correo electrónico'
        className='col-span-full text-sm md:col-span-4 lg:text-base'
        type='text'
      />
      <Controller
        control={control}
        name='nro_telefono'
        rules={{ required: { value: true, message: 'El nro. es requerido' } }}
        render={({ field }) => (
          <PhoneNumberInput
            onChange={field.onChange}
            value={field.value}
            className='col-span-full md:!col-span-4'
          />
        )}
      />
      <div className='group relative col-span-full flex h-fit items-center'>
        <Input
          {...register('contrasena', {
            required: {
              value: true,
              message: 'La contraseña es requerida.',
            },
          })}
          type={!showPassword ? 'password' : 'text'}
          placeholder='Contraseña'
          className='text-sm lg:text-base'
        />
        <Button
          type='button'
          variant='link'
          className='absolute end-0 opacity-60 group-focus-within:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100'
          size='icon'
          onClick={handleShowPassword}
        >
          {!showPassword ? <EyeClosed /> : <Eye />}
        </Button>
      </div>
      <div className='col-span-full flex h-fit flex-col items-start gap-2'>
        <div className={'group relative flex w-full items-center'}>
          <Input
            {...register('confirmar_contrasena', {
              required: {
                value: true,
                message: 'Debes confirmar la contraseña.',
              },
              validate: (value) =>
                value === password || 'Las contraseñas no coinciden',
            })}
            type={!showPassword ? 'password' : 'text'}
            placeholder='Confirmar contraseña'
            className='text-sm lg:text-base'
          />
          <Button
            type='button'
            variant='link'
            className='absolute end-0 opacity-60 group-focus-within:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100'
            size='icon'
            onClick={handleShowPassword}
          >
            {!showPassword ? <EyeClosed /> : <Eye />}
          </Button>
        </div>
        {hasErrorConfirmPassword && (
          <p className='text-xs text-red-500'>Las contraseñas no coinciden</p>
        )}
      </div>
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
}
