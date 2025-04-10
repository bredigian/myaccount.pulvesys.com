import { Aplicacion } from './aplicaciones.types';
import { Campo } from './campos.types';
import { ConsumoProducto } from './productos.types';
import { Cultivo } from './cultivos.types';
import { Tratamiento } from './tratamientos.types';
import { UUID } from 'crypto';
import { Usuario } from './usuario.types';

export interface Detalle {
  id?: UUID;
  campo_id: UUID;
  campo?: Campo;
  lotes: string[];
  cultivo_id: UUID;
  cultivo?: Cultivo;
  tratamiento_id: UUID;
  tratamiento?: Tratamiento;
  observacion?: string;
}

export interface Pulverizacion {
  id?: UUID;
  fecha: Date | string;
  detalle_id?: UUID;
  detalle: Detalle;
  productos: Aplicacion[];
  Aplicacion?: Aplicacion[];
  ConsumoProducto?: ConsumoProducto[];

  usuario?: Usuario;

  createdAt?: Date | string;
  updatedAt?: Date | string;
}
