import { UUID } from 'crypto';

export interface Crop {
  id?: UUID;
  nombre: string;
  color?: string;
}
