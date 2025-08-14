import { UUID } from 'crypto';

export interface Lot {
  id?: UUID | string;
  nombre: string | null;
  hectareas: number | null;
  zona: Coordinate[];
  Coordinada?: Coordinate[];
  color: string | null;
  campo_id?: UUID;
}

export interface Coordinate {
  id?: string;
  lote_id?: UUID;
  lat: number;
  lng: number;
}

export interface Location {
  id?: UUID;
  nombre: string;
  Lote?: Lot[];
  polygonsToDelete?: Lot['id'][];
}
