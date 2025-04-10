import { UUID } from 'crypto';
import { Usuario } from './usuario.types';

export enum LOG_NOMBRE {
  PULVERIZACION = 'Pulverización',
  PRODUCTO = 'Producto',
  CULTIVO = 'Cultivo',
  TRATAMIENTO = 'Tratamiento',
  UBICACION = 'Ubicación',
  USUARIO = 'Usuario',
  SUSCRIPCION = 'Suscripción',
}

export interface Log {
  id: UUID;
  type: keyof typeof LOG_NOMBRE;
  description: string;
  usuario_id?: Usuario['id'];
  usuario?: Partial<Usuario>;
  createdAt: Date | string;
}
