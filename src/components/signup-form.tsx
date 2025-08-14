'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Dot, Eye, EyeClosed, LogIn, ShieldCheck } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';

import { APIError } from '@/types/error.types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Link from 'next/link';
import PhoneNumberInput from './phone-number-input';
import { Plan } from '@/types/plans.types';
import { ReloadIcon } from '@radix-ui/react-icons';
import { SelectValue } from '@radix-ui/react-select';
import TerminosCondiciones from './terms&conditions-container';
import { UserToSignup } from '@/types/users.types';
import { cn } from '@/lib/utils';
import { signup } from '@/services/auth.service';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  planes: Plan[];
}

interface SignupFormProps extends UserToSignup {
  terminos_condiciones?: boolean;
}

export const SignupForm = ({ planes }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
    watch,
  } = useForm<SignupFormProps>();

  const selectedPlan = watch('plan_id');

  const { push } = useRouter();

  const onInvalidSubmit = async (errors: FieldErrors<SignupFormProps>) => {
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
    else if (errors?.plan_id)
      toast.error(errors.plan_id?.message, { position: 'top-center' });
    else if (errors?.terminos_condiciones)
      toast.error(errors.terminos_condiciones?.message, {
        position: 'top-center',
      });
  };

  const [success, setSuccess] = useState(false);

  const onSubmit = async (values: SignupFormProps) => {
    try {
      const PAYLOAD: SignupFormProps = {
        ...values,
        nombre: values.nombre.trim(),
        apellido: values.apellido.trim(),
        nombre_usuario: values.nombre_usuario?.trim().toLowerCase() as string,
        confirmar_contrasena: undefined,
        terminos_condiciones: undefined,
      };
      await signup(PAYLOAD);

      setSuccess(true);
      setTimeout(() => push('/dashboard'), 1000);
    } catch (error) {
      const { message } = error as APIError;
      toast.error(message, { position: 'top-center' });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const password = watch('contrasena');
  const confirmPassword = watch('confirmar_contrasena');
  const hasErrorConfirmPassword = !confirmPassword
    ? false
    : confirmPassword !== password;

  const selectedPlanData = planes.find((plan) => plan.id === selectedPlan);

  const isMobile = useIsMobile();

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>
          <Label
            htmlFor='nombre_input'
            className='col-span-full mb-2 self-start md:text-base'
          >
            Completa el siguiente formulario
          </Label>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className='grid h-full w-full grid-cols-8 gap-4'
          onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
        >
          <Input
            {...register('nombre', {
              required: {
                value: true,
                message: 'El nombre es requerido.',
              },
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres.',
              },
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
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres.',
              },
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
              minLength: {
                value: 6,
                message: 'Debe tener al menos 6 caracteres.',
              },
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
            className='col-span-full text-sm md:col-span-5 lg:col-span-4 lg:text-base xl:col-span-5'
            type='text'
          />
          <Controller
            control={control}
            name='nro_telefono'
            rules={{
              required: { value: true, message: 'El nro. es requerido' },
            }}
            render={({ field }) => (
              <PhoneNumberInput onChange={field.onChange} value={field.value} />
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
              <p className='text-xs text-red-500'>
                Las contraseñas no coinciden
              </p>
            )}
          </div>
          <section className='col-span-full my-4 flex flex-col gap-4'>
            <Controller
              control={control}
              name='plan_id'
              rules={{
                required: { value: true, message: 'El plan es requerido' },
              }}
              render={({ field }) => (
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className='col-span-3 !mt-0 text-sm lg:text-base'>
                    <SelectValue placeholder='Seleccione un plan' />
                  </SelectTrigger>
                  <SelectContent className='col-span-3' align='start'>
                    {planes.map((plan) => (
                      <SelectItem key={plan.nombre} value={plan.id}>
                        {plan.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {selectedPlanData && (
              <Card className='bg-secondary'>
                <CardHeader>
                  <CardTitle className='flex w-full items-center justify-between'>
                    <h4>{selectedPlanData?.nombre}</h4>
                    <Badge className='lg:text-base'>
                      ${selectedPlanData?.valor.toLocaleString('es-AR')}/mes
                    </Badge>
                  </CardTitle>
                  <CardDescription hidden></CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className='flex flex-col gap-2'>
                    {selectedPlanData?.descripcion.map((feature) => (
                      <li
                        key={`${selectedPlanData?.descripcion}_${feature}`}
                        className='flex items-center gap-1 opacity-75'
                      >
                        <Dot className='size-6 shrink-0 lg:size-8' />
                        <p className='text-sm lg:text-base'>{feature}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </section>
          <Controller
            control={control}
            name='terminos_condiciones'
            rules={{
              required: {
                value: true,
                message: 'Tenés que aceptar los términos y condiciones.',
              },
            }}
            defaultValue={false}
            render={({ field }) => (
              <div className='col-span-full flex items-center space-x-2'>
                <Checkbox
                  id='terms'
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  defaultChecked={false}
                />
                <label
                  htmlFor='terms'
                  className='cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Acepto los{' '}
                  {!isMobile ? (
                    <Dialog>
                      <DialogTrigger className='underline'>
                        Términos y Condiciones
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Términos y Condiciones</DialogTitle>
                          <DialogDescription>
                            Último actualización: 14 de abril de 2025
                          </DialogDescription>
                        </DialogHeader>
                        <section className='max-h-[60dvh] overflow-auto'>
                          <TerminosCondiciones hideTitle />
                        </section>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant={'outline'} type='button'>
                              Cerrar
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Drawer>
                      <DrawerTrigger className='underline'>
                        Términos y Condiciones
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Términos y Condiciones</DrawerTitle>
                          <DrawerDescription>
                            Última actuialización: 14 de abril de 2025
                          </DrawerDescription>
                        </DrawerHeader>
                        <section className='max-h-[75dvh] overflow-auto px-4'>
                          <TerminosCondiciones hideTitle />
                        </section>
                        <DrawerFooter>
                          <DrawerClose asChild>
                            <Button variant={'outline'} type='button'>
                              Cerrar
                            </Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  )}
                </label>
              </div>
            )}
          />

          <Button
            type='submit'
            className={cn(
              'col-span-full self-end disabled:opacity-100 lg:text-base',
              !success
                ? 'bg-primary'
                : '!bg-green-700 text-primary-foreground dark:text-primary',
            )}
            disabled={isSubmitting || success}
          >
            {success ? (
              <>
                Completado <ShieldCheck className='lg:!size-5' />
              </>
            ) : !isSubmitting ? (
              <>
                Registrarse <LogIn className='lg:!size-5' />
              </>
            ) : (
              <>
                Procesando <ReloadIcon className='animate-spin lg:!size-5' />
              </>
            )}
          </Button>
          <Link
            href={'/'}
            className='col-span-full w-fit justify-self-center text-center text-sm underline'
          >
            ¿Ya tenés una cuenta? Inicia sesión
          </Link>
        </form>
      </CardContent>
    </Card>
  );
};
