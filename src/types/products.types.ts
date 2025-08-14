import { UUID } from 'crypto';

export enum UNITY {
  LITROS = 'LITROS',
  GRAMOS = 'GRAMOS',
  KILOGRAMOS = 'KILOGRAMOS',
}

export enum SHORT_UNITY {
  LITROS = 'L',
  GRAMOS = 'g',
  KILOGRAMOS = 'kg',
}

export interface Product {
  id?: UUID;
  nombre: string;
  unidad: UNITY;
}

export interface ProductConsume {
  id?: UUID;
  pulverizacion_id?: UUID;
  producto_id?: UUID;
  valor_teorico: number;
  valor_real?: number;
  valor_devolucion?: number;
}
