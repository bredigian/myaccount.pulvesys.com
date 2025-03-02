import { API_URL } from '@/config/api';
import { APIError } from '@/types/error.types';
import { Tratamiento } from '@/types/tratamientos.types';
import { UUID } from 'crypto';

export const getTratamientos = async (access_token: string) => {
  const PATH = `${API_URL}/v1/tratamientos`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    headers: { Authorization: `Bearer ${access_token}` },
    next: { tags: ['tratamientos'] },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Tratamiento[] | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Tratamiento[];
};

export const addTratamiento = async (
  payload: Tratamiento,
  access_token: string,
) => {
  const PATH = `${API_URL}/v1/tratamientos`;
  const OPTIONS: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Tratamiento | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Tratamiento;
};

export const editTratamiento = async (
  payload: Tratamiento,
  access_token: string,
) => {
  const PATH = `${API_URL}/v1/tratamientos`;
  const OPTIONS: RequestInit = {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Tratamiento | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Tratamiento;
};

export const deleteTratamiento = async (id: UUID, access_token: string) => {
  const PATH = `${API_URL}/v1/tratamientos`;
  const OPTIONS: RequestInit = {
    method: 'DELETE',
    body: JSON.stringify({ id }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: { count: number } | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as { count: number };
};
