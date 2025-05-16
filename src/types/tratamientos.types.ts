import { UUID } from 'crypto';

export interface Tratamiento {
  id?: UUID;
  nombre: string;

  isCached?: boolean;
}
