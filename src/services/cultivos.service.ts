import { API_URL } from '@/config/api';
import { Token } from '@/types/auth.types';
import { Cultivo } from '@/types/cultivos.types';
import { APIError } from '@/types/error.types';
import { UUID } from 'crypto';

export const getCultivos = async (
  access_token: string,
  refresh_token: Token,
) => {
  const PATH = `${API_URL}/v1/cultivos`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${access_token}`,
      Cookie: JSON.stringify(refresh_token),
    },
    next: { tags: ['cultivos'] },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Cultivo[] | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Cultivo[];
};

export const addCultivo = async (payload: Cultivo, access_token: string) => {
  const PATH = `${API_URL}/v1/cultivos`;
  const OPTIONS: RequestInit = {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Cultivo | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Cultivo;
};

export const editCultivo = async (payload: Cultivo, access_token: string) => {
  const PATH = `${API_URL}/v1/cultivos`;
  const OPTIONS: RequestInit = {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Cultivo | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Cultivo;
};

export const deleteCultivo = async (id: UUID, access_token: string) => {
  const PATH = `${API_URL}/v1/cultivos`;
  const OPTIONS: RequestInit = {
    method: 'DELETE',
    credentials: 'include',
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
