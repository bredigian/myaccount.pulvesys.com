import { ROLES } from '@/types/usuario.types';

interface PlanData {
  value: keyof typeof ROLES;
  price: number;
  description: string;
}
export const PLANES_DATA: PlanData[] = [
  {
    value: 'EMPRESA',
    price: 33000,
    description: 'Descripción a futuro...',
  },
  {
    value: 'INDIVIDUAL',
    price: 21500,
    description: 'Descripción a futuro...',
  },
];
