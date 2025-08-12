import { UUID } from 'crypto';

export interface Cultivo {
  id?: UUID;
  nombre: string;
  color?: string;
}
