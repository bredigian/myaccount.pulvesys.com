import { Campo } from './campos.types';
import { Cultivo } from './cultivos.types';
import { Producto } from './productos.types';
import { Pulverizacion } from './pulverizaciones.types';
import { Tratamiento } from './tratamientos.types';

export interface AllData {
  campos: Campo[];
  cultivos: Cultivo[];
  tratamientos: Tratamiento[];
  productos: Producto[];
  pulverizaciones: Pulverizacion[];
}
