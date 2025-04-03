import { Plan } from './planes.types';
import { UUID } from 'crypto';
import { Usuario } from './usuario.types';

export interface PayloadInitPoint {
  plan_id: UUID;
  valor_actual: number;
}

export enum STATUS {
  pending = 'Suscripción pendiente',
  authorized = 'Suscripción activa',
  cancelled = 'Suscripción cancelada',
}

export enum SUBSCRIPTION_MESSAGE {
  welcome = 'Bienvenido a PulveSys',
  warning = 'Atención',
  cancelled = 'Tu suscripción fué cancelada',
  disabled = 'disabled',
}

export interface Suscripcion {
  id: UUID;
  plan: Plan;
  fecha_fin: Date | string;
  next_payment_date?: Date | string;
  free_trial: boolean;
  status: keyof typeof STATUS;
  message_info: keyof typeof SUBSCRIPTION_MESSAGE;
  createdAt: Date | string;
  updatedAt: Date | string;
}
