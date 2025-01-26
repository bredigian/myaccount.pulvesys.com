import { API_URL } from '@/config/api';
import { Campo } from '@/types/campos.types';
import { UUID } from 'crypto';

export const getCampos = async () => {
  const PATH = `${API_URL}/v1/campos`;
  const OPTIONS: RequestInit = { method: 'GET', next: { tags: ['campos'] } };

  const res = await fetch(PATH, OPTIONS);
  const data: Campo[] | Error = await res.json();

  if (!res.ok) return new Error((data as Error)?.message);

  return data as Campo[];
};

export const addCampo = async (payload: Campo) => {
  const PATH = `${API_URL}/v1/campos`;
  const OPTIONS: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Campo | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as Campo;
};

export const editCampo = async (payload: Campo) => {
  const PATH = `${API_URL}/v1/campos`;
  const OPTIONS: RequestInit = {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Campo | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as Campo;
};

export const deleteCampo = async (id: UUID) => {
  const PATH = `${API_URL}/v1/campos`;
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
