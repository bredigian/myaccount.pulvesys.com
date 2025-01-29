import { Producto } from './productos.types';
import { Pulverizacion } from './pulverizaciones.types';
import { UUID } from 'crypto';

export interface Aplicacion {
  id?: UUID;
  pulverizacion_id?: UUID;
  pulverizacion?: Pulverizacion;
  producto_id: UUID;
  producto?: Producto;
  dosis: number;
}

export interface AplicacionConConsumo extends Aplicacion {
  valor_real?: number | null;
  valor_teorico?: number;

  consumo_id?: UUID;
}
