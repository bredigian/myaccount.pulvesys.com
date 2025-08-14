import { Plan } from './plans.types';
import { UUID } from 'crypto';

export interface PayloadInitPoint {
  plan_id: UUID;
  valor_actual: number;
}

export enum STATUS {
  pending = 'Suscripción pendiente',
  authorized = 'Suscripción activa',
  paused = 'Suscripción pausada',
  cancelled = 'Suscripción cancelada',
}

export enum SUBSCRIPTION_MESSAGE {
  welcome = 'Bienvenido a PulveSys',
  warning = 'Atención',
  payment_warning = 'Atención con el pago',
  paused = 'Tu suscripción fue pausada',
  cancelled = 'Tu suscripción fue cancelada',
  disabled = 'disabled',
}

interface SummarizedProps {
  quotas: number | null;
  charged_quantity: number;
  pending_charge_quantity: number | null;
  charged_amount: number;
  pending_charge_amount: number | null;
  semaphore: 'green' | 'yellow' | 'red';
  last_charged_date: Date | string;
  last_charged_amount: number;
}

export interface Subscription {
  id: UUID;
  plan: Plan;
  fecha_fin: Date | string;
  next_payment_date?: Date | string;
  free_trial: boolean;
  status: keyof typeof STATUS;
  message_info: keyof typeof SUBSCRIPTION_MESSAGE;
  createdAt: Date | string;
  updatedAt: Date | string;
  extra?: SummarizedProps;
}
