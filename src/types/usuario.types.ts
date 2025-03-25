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
  rol: keyof typeof ROLES;
}

export interface Usuario extends UsuarioToSignup {
  id?: string;
  empresa_id?: string;
  Sesion?: Sesion[];
}

export interface Sesion {
  access_token: string;
  refresh_token?: UUID;
  expireIn: Date;
  userdata: Usuario;
  domain: string;
}
