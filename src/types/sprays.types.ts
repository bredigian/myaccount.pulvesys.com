import { Application } from './applications.types';
import { Crop } from './crops.types';
import { Location } from './locations.types';
import { ProductConsume } from './products.types';
import { Treatment } from './treatments.types';
import { UUID } from 'crypto';
import { User } from './users.types';

export interface SprayDetail {
  id?: UUID;
  campo_id: UUID;
  campo?: Location;
  lotes: string[];
  cultivo_id: UUID;
  cultivo?: Crop;
  tratamiento_id: UUID;
  tratamiento?: Treatment;
  observacion?: string;
}

export interface Spray {
  id?: UUID;
  fecha: Date | string;
  detalle_id?: UUID;
  detalle: SprayDetail;
  productos: Application[];
  Aplicacion?: Application[];
  ConsumoProducto?: ProductConsume[];

  usuario?: User;

  createdAt?: Date | string;
  updatedAt?: Date | string;
}
