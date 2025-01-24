import { API_URL } from '@/config/api';
import { Tratamiento } from '@/types/tratamientos.types';
import { UUID } from 'crypto';

export const getTratamientos = async () => {
  const PATH = `${API_URL}/v1/tratamientos`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    next: { tags: ['tratamientos'] },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Tratamiento[] | Error = await res.json();

  if (!res.ok) return new Error((data as Error)?.message);

  return data as Tratamiento[];
};

export const addTratamiento = async (payload: Tratamiento) => {
  const PATH = `${API_URL}/v1/tratamientos`;
  const OPTIONS: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Tratamiento | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as Tratamiento;
};

export const editTratamiento = async (payload: Tratamiento) => {
  const PATH = `${API_URL}/v1/tratamientos`;
  const OPTIONS: RequestInit = {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Tratamiento | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as Tratamiento;
};

export const deleteTratamiento = async (id: UUID) => {
  const PATH = `${API_URL}/v1/tratamientos`;
  const OPTIONS: RequestInit = {
    method: 'DELETE',
    body: JSON.stringify({ id }),
    headers: { 'Content-Type': 'application/json' },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: { count: number } | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as { count: number };
};
