import { Campo } from './campos.types';
import { Cultivo } from './cultivos.types';
import { Producto } from './productos.types';
import { Tratamiento } from './tratamientos.types';

export interface AllData {
  campos: Campo[];
  cultivos: Cultivo[];
  tratamientos: Tratamiento[];
  productos: Producto[];
}

export type STATE = 'pending' | 'processing' | 'success';
