import { API_URL } from '@/config/api';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import { UUID } from 'crypto';

export const getPulverizaciones = async () => {
  const PATH = `${API_URL}/v1/pulverizaciones`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    next: { tags: ['pulverizaciones'] },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Pulverizacion[] | Error = await res.json();

  if (!res.ok) return new Error((data as Error)?.message);

  return data as Pulverizacion[];
};

export const addPulverizacion = async (payload: Pulverizacion) => {
  const PATH = `${API_URL}/v1/pulverizaciones`;
  const OPTIONS: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Pulverizacion | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as Pulverizacion;
};

export const editPulverizacion = async (payload: Pulverizacion) => {
  const PATH = `${API_URL}/v1/pulverizaciones`;
  const OPTIONS: RequestInit = {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Pulverizacion | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as Pulverizacion;
};

export const deletePulverizacion = async (id: UUID) => {
  const PATH = `${API_URL}/v1/pulverizaciones`;
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
