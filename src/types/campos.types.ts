import { UUID } from 'crypto';

export interface Lote {
  id?: UUID;
  nombre: string | null;
  zona: Coordinada[];
  color: string | null;
  campo_id?: UUID;
}

export interface Coordinada {
  lote_id?: UUID;
  lat: number;
  lng: number;
}

export interface Campo {
  id?: UUID;
  nombre: string;
  hectareas: number;
  lotes?: Lote[];
}
