import { UUID } from 'crypto';

export interface Lote {
  id?: UUID | string;
  nombre: string | null;
  hectareas: number | null;
  zona: Coordinada[];
  Coordinada?: Coordinada[];
  color: string | null;
  campo_id?: UUID;
}

export interface Coordinada {
  id?: string;
  lote_id?: UUID;
  lat: number;
  lng: number;
}

export interface Campo {
  id?: UUID;
  nombre: string;
  Lote?: Lote[];
  polygonsToDelete?: Lote['id'][];
}
