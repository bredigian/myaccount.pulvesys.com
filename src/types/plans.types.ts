import { ROLES } from './users.types';
import { UUID } from 'crypto';

export interface Plan {
  id: UUID;
  nombre: keyof typeof ROLES;
  descripcion: string[];
  valor: number;
  valor_actual?: number;
}
