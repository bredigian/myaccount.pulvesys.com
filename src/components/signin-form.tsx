'use client';

import { KeyRound, LogIn, User } from 'lucide-react';

import { Button } from './ui/button';
import Cookies from 'js-cookie';
import { Input } from './ui/input';
import { ReloadIcon } from '@radix-ui/react-icons';
import { UsuarioToSignin } from '@/types/usuario.types';
import { signin } from '@/services/auth.service';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

export default function SigninForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UsuarioToSignin>();

  const { replace } = useRouter();

  const onInvalidSubmit = async (errors: any) => {
    if (errors?.nombre_usuario)
      toast.error(errors.nombre_usuario?.message, { position: 'top-center' });
    else if (errors?.contrasena)
      toast.error(errors.contrasena?.message, { position: 'top-center' });
  };

  const onSubmit = async (values: UsuarioToSignin) => {
    try {
      const { access_token, expireIn, userdata } = await signin(values);
      Cookies.set('access_token', access_token, {
        expires: new Date(expireIn),
      });

      replace('/panel');
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return (
    <form
      className='space-y-4'
      onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
    >
      <div className='group relative flex items-center'>
        <User className='absolute pl-2 opacity-60 group-focus-within:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100' />
        <Input
          {...register('nombre_usuario', {
            required: {
              value: true,
              message: 'El nombre de usuario es requerido.',
            },
          })}
          placeholder='Usuario'
          className='peer pl-7 text-sm'
          type='text'
        />
      </div>
      <div className='group relative flex items-center'>
        <KeyRound className='absolute pl-2 opacity-60 group-focus-within:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100' />
        <Input
          {...register('contrasena', {
            required: {
              value: true,
              message: 'La contraseña es requerida.',
            },
          })}
          type='password'
          placeholder='Contraseña'
          className='peer pl-7 text-sm'
        />
      </div>
      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {!isSubmitting ? (
          <>
            Iniciar sesión <LogIn />
          </>
        ) : (
          <>
            Autenticando <ReloadIcon className='animate-spin' />
          </>
        )}
      </Button>
    </form>
  );
}
