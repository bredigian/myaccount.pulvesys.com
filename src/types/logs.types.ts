import { UUID } from 'crypto';
import { User } from './users.types';

export enum LOG_NAME {
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
  type: keyof typeof LOG_NAME;
  description: string;
  usuario_id?: User['id'];
  usuario?: Partial<User>;
  createdAt: Date | string;
}
