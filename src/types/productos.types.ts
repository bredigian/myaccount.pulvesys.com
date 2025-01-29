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

export interface ConsumoProducto {
  id?: UUID;
  pulverizacion_id?: UUID;
  producto_id?: UUID;
  valor_teorico: number;
  valor_real?: number;
  valor_devolucion?: number;
}
