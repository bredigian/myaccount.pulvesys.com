import { Plan } from './planes.types';
import { Suscripcion } from './suscripciones.types';
import { UUID } from 'crypto';

export enum ROLES {
  ADMIN = 'Administrador',
  EMPRESA = 'Empresa',
  INDIVIDUAL = 'Individual',
}

export interface UsuarioToSignin {
  nombre_usuario: string | null;
  contrasena?: string;
}

export interface UsuarioToSignup extends UsuarioToSignin {
  confirmar_contrasena?: string;
  nombre: string;
  apellido: string;
  email: string;
  nro_telefono: string;
  plan_id: Plan['id'];
  rol: keyof typeof ROLES;
}

export interface CreateUsuarioProps
  extends Omit<UsuarioToSignup, 'rol' | 'plan_id'> {}

export interface UpdateUsuarioProps
  extends Omit<UsuarioToSignup, 'rol' | 'plan_id'> {
  id: Usuario['id'];
}

export interface Usuario extends UsuarioToSignup {
  id?: string;
  empresa_id?: string;
  Sesion?: Sesion[];

  isEmployer: boolean;
  suscripcion: Partial<Suscripcion>;
}

export interface Sesion {
  access_token: string;
  refresh_token?: UUID;
  expireIn: Date;
  userdata: Usuario;
  domain: string;
}
