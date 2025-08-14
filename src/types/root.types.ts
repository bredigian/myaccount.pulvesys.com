import { Campo } from './locations.types';
import { Cultivo } from './crops.types';
import { Producto } from './products.types';
import { Pulverizacion } from './sprays.types';
import { Tratamiento } from './treatments.types';

export interface AllData {
  campos: Campo[];
  cultivos: Cultivo[];
  tratamientos: Tratamiento[];
  productos: Producto[];
  pulverizaciones: Pulverizacion[];
}
