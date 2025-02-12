import { Coordinada } from '@/types/campos.types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calcularCentroide = (coordinadas: Coordinada[]) => {
  let x = 0,
    y = 0;
  const n = coordinadas.length;

  coordinadas.forEach(({ lng, lat }) => {
    x += lng;
    y += lat;
  });

  return [x / n, y / n];
};
