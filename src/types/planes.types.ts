import { ROLES } from './usuario.types';
import { UUID } from 'node:crypto';

export interface Plan {
  id: UUID;
  nombre: keyof typeof ROLES;
  descripcion: string[];
  valor: number;
  valor_actual?: number;
}
