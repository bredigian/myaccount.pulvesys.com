import { API_URL } from '@/config/api';
import { Campo } from '@/types/campos.types';
import { APIError } from '@/types/error.types';
import { UUID } from 'crypto';

export const getCampos = async (access_token: string) => {
  const PATH = `${API_URL}/v1/campos`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    headers: { Authorization: `Bearer ${access_token}` },
    cache: 'no-cache',
    next: { tags: ['campos'] },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Campo[] | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Campo[];
};

export const addCampo = async (payload: Campo, access_token: string) => {
  const PATH = `${API_URL}/v1/campos`;
  const OPTIONS: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Campo | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Campo;
};

export const editCampo = async (payload: Campo, access_token: string) => {
  const PATH = `${API_URL}/v1/campos`;
  const OPTIONS: RequestInit = {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Campo | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Campo;
};

export const deleteCampo = async (id: UUID, access_token: string) => {
  const PATH = `${API_URL}/v1/campos`;
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

export const deleteLote = async (id: UUID, access_token: string) => {
  const PATH = `${API_URL}/v1/campos/lote`;
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
