import { Product } from './products.types';
import { Spray } from './sprays.types';
import { UUID } from 'crypto';

export interface Application {
  id?: UUID;
  pulverizacion_id?: UUID;
  pulverizacion?: Spray;
  producto_id: UUID;
  producto?: Product;
  dosis: number;
}

export interface ApplicationWithConsume extends Application {
  valor_real?: number | null;
  valor_teorico?: number;

  consumo_id?: UUID;
}
