import { UUID } from 'crypto';

export enum UNIDAD {
  LITROS = 'Litros',
  GRAMOS = 'Gramos',
}

export interface Producto {
  id?: UUID;
  nombre: string;
  unidad: UNIDAD;
  cantidad: number;
}
