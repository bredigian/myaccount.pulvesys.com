import { Plan } from './plans.types';
import { Subscription } from './subscriptions.types';
import { UUID } from 'crypto';

export enum ROLES {
  ADMIN = 'Administrador',
  EMPRESA = 'Empresa',
  INDIVIDUAL = 'Individual',
}

export interface UserToSignin {
  nombre_usuario: string | null;
  contrasena?: string;
}

export interface UserToSignup extends UserToSignin {
  confirmar_contrasena?: string;
  nombre: string;
  apellido: string;
  email: string;
  nro_telefono: string;
  plan_id: Plan['id'];
  rol: keyof typeof ROLES;
}

export interface UpdateUserProps extends Omit<UserToSignup, 'rol' | 'plan_id'> {
  id: User['id'];
}

export interface User extends UserToSignup {
  id?: string;
  empresa_id?: string;
  Sesion?: Session[];

  isEmployer: boolean;
  suscripcion: Partial<Subscription>;
}

export interface Session {
  access_token: string;
  refresh_token?: UUID;
  expireIn: Date;
  userdata: User;
  domain: string;
}
