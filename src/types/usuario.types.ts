import { UUID } from 'crypto';
import { TEnvironment } from './environment.types';

export interface UsuarioToSignin {
  nombre_usuario: string | null;
  contrasena?: string;
}

export interface Usuario extends UsuarioToSignin {
  id?: string;
  nombre: string | null;
  apellido: string | null;
  Sesion?: Sesion[];
}

export interface Sesion {
  access_token: string;
  refresh_token?: UUID;
  expireIn: Date;
  userdata: Usuario;
  environment: TEnvironment;
}
