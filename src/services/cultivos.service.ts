import { API_URL } from '@/config/api';
import { Cultivo } from '@/types/cultivos.types';
import { UUID } from 'crypto';

export const getCultivos = async (access_token: string) => {
  const PATH = `${API_URL}/v1/cultivos`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    headers: { Authorization: `Bearer ${access_token}` },
    next: { tags: ['cultivos'] },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Cultivo[] | Error = await res.json();

  if (!res.ok) return new Error((data as Error)?.message);

  return data as Cultivo[];
};

export const addCultivo = async (payload: Cultivo, access_token: string) => {
  const PATH = `${API_URL}/v1/cultivos`;
  const OPTIONS: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Cultivo | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as Cultivo;
};

export const editCultivo = async (payload: Cultivo, access_token: string) => {
  const PATH = `${API_URL}/v1/cultivos`;
  const OPTIONS: RequestInit = {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Cultivo | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as Cultivo;
};

export const deleteCultivo = async (id: UUID, access_token: string) => {
  const PATH = `${API_URL}/v1/cultivos`;
  const OPTIONS: RequestInit = {
    method: 'DELETE',
    body: JSON.stringify({ id }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: { count: number } | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as { count: number };
};
