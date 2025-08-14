import { Crop } from './crops.types';
import { Location } from './locations.types';
import { Product } from './products.types';
import { Spray } from './sprays.types';
import { Treatment } from './treatments.types';

export interface AllData {
  campos: Location[];
  cultivos: Crop[];
  tratamientos: Treatment[];
  productos: Product[];
  pulverizaciones: Spray[];
}
