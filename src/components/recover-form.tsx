'use client';

import { Check, Eye, EyeClosed, User } from 'lucide-react';
import { FieldErrors, useForm } from 'react-hook-form';
import {
  generateRecoverPassword,
  resetPassword,
} from '@/services/auth.service';

import { APIError } from '@/types/error.types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ReloadIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface RecoverFormProps {
  email: string;
}

type State = 'pending' | 'processing' | 'success' | 'error';

interface Props {
  token?: string;
  handleDialog: () => void;
}

export const RecoverForm = ({ handleDialog }: Props) => {
  const { register, handleSubmit } = useForm<RecoverFormProps>();
  const [state, setState] = useState<State>('pending');

  const onInvalidSubmit = async (errors: FieldErrors<RecoverFormProps>) => {
    if (errors?.email)
      toast.error(errors.email?.message, { position: 'top-center' });
  };

  const onSubmit = async (values: RecoverFormProps) => {
    try {
      setState('processing');

      await generateRecoverPassword(values.email.trim());
      setState('success');

      setTimeout(() => {
        toast.success('Revisa tu bandeja de entrada y/o tu spam.');
        handleDialog();
      }, 1000);
    } catch (e) {
      setState('error');

      const { message } = e as APIError;
      toast.error(message, { position: 'top-center' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
      className='flex w-full flex-col gap-4 p-4 md:flex-row md:p-0'
    >
      <div className='group relative flex w-full items-center'>
        <User className='absolute pl-2 opacity-60 group-focus-within:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100' />
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
          className='peer pl-8 text-sm lg:text-base'
          type='text'
        />
      </div>
      <Button
        disabled={state === 'success' || state === 'processing'}
        className={cn(
          'w-full md:w-fit',
          state === 'success'
            ? '!bg-green-700 !text-primary disabled:opacity-100'
            : '',
        )}
        type='submit'
      >
        {state === 'processing' ? (
          <>
            Enviando <ReloadIcon className='animate-spin' />
          </>
        ) : state === 'success' ? (
          <>
            Completado <Check />
          </>
        ) : (
          'Enviar'
        )}
      </Button>
    </form>
  );
};

interface ResetPasswordFormProps {
  contrasena: string;
  confirmar_contrasena: string;
}

export const ResetPasswordForm = ({ token }: { token: string }) => {
  const { push } = useRouter();

  const { register, handleSubmit, watch } = useForm<ResetPasswordFormProps>();
  const [state, setState] = useState<State>('pending');

  const onInvalidSubmit = async (
    errors: FieldErrors<ResetPasswordFormProps>,
  ) => {
    if (errors?.contrasena)
      toast.error(errors.contrasena?.message, { position: 'top-center' });
    if (errors?.confirmar_contrasena)
      toast.error(errors.confirmar_contrasena?.message, {
        position: 'top-center',
      });
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const onSubmit = async (values: ResetPasswordFormProps) => {
    try {
      setState('processing');
      if (!token) {
        toast.error('El token es requerido.');
        return;
      }

      await resetPassword(token, { contrasena: values.contrasena });
      setState('success');

      setTimeout(() => {
        toast.success('La contraseña fue actualizada.');
        push('/');
      }, 1000);
    } catch (e) {
      setState('error');

      const { message } = e as APIError;
      toast.error(message, { position: 'top-center' });
    }
  };

  const password = watch('contrasena');
  const confirmPassword = watch('confirmar_contrasena');
  const hasErrorConfirmPassword = !confirmPassword
    ? false
    : confirmPassword !== password;

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
      className='flex w-full flex-col gap-4'
    >
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
      <p className='text-sm opacity-50'>
        *Se eliminarán cerrarán todas las sesiones iniciadas
      </p>
      <Button
        disabled={state === 'success' || state === 'processing'}
        className={cn(
          'w-full self-end md:w-fit',
          state === 'success'
            ? '!bg-green-700 text-primary disabled:opacity-100'
            : '',
        )}
        type='submit'
      >
        {state === 'processing' ? (
          <>
            Enviando <ReloadIcon className='animate-spin' />
          </>
        ) : state === 'success' ? (
          <>
            Completado <Check />
          </>
        ) : (
          'Actualizar'
        )}
      </Button>
    </form>
  );
};
