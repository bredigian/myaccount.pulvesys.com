import { UUID } from 'crypto';

export interface Lote {
  nombre: string | null;
  zona: Coordinada[];
  color: string | null;
}

export interface Coordinada {
  lat: number;
  lng: number;
}

export interface Campo {
  id?: UUID;
  nombre: string;
  hectareas: number;
}
