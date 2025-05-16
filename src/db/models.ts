import { AllData } from '@/types/root.types';
import { Campo } from '@/types/campos.types';
import { Cultivo } from '@/types/cultivos.types';
import { Producto } from '@/types/productos.types';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import { Tratamiento } from '@/types/tratamientos.types';
import { Usuario } from '@/types/usuario.types';

export type DataType =
  | 'pulverizacion'
  | 'campo'
  | 'producto'
  | 'cultivo'
  | 'tratamiento';

export interface PendingSync {
  id?: number;
  data: Pulverizacion | Campo | Producto | Cultivo | Tratamiento;
  type: DataType;
  endpoint: string;
  method: string;
  createdAt: number;
}

export interface Session {
  id?: number;
  token: string;
  userdata: Usuario;
  expiresAt: number;
  lastValidated: number;
}
