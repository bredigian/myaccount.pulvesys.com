import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calcularCentroide = (
  coordinadas: GeoJSON.Polygon['coordinates'][0],
) => {
  let x = 0,
    y = 0;
  const n = coordinadas.length;

  coordinadas.forEach((item) => {
    const lng = item[0];
    const lat = item[1];
    x += lng;
    y += lat;
  });

  return [x / n, y / n];
};
