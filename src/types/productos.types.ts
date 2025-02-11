import { UUID } from 'crypto';

export enum UNIDAD {
  LITROS = 'LITROS',
  GRAMOS = 'GRAMOS',
  KILOGRAMOS = 'KILOGRAMOS',
}

export enum SHORT_UNIDAD {
  LITROS = 'L',
  GRAMOS = 'g',
  KILOGRAMOS = 'kg',
}

export interface Producto {
  id?: UUID;
  nombre: string;
  unidad: UNIDAD;
}

export interface ConsumoProducto {
  id?: UUID;
  pulverizacion_id?: UUID;
  producto_id?: UUID;
  valor_teorico: number;
  valor_real?: number;
  valor_devolucion?: number;
}
