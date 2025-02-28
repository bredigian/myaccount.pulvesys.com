import { API_URL } from '@/config/api';
import { Token } from '@/types/auth.types';
import { Campo } from '@/types/campos.types';
import { UUID } from 'crypto';

export const getCampos = async (access_token: string, refresh_token: Token) => {
  const PATH = `${API_URL}/v1/campos`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${access_token}`,
      Cookie: JSON.stringify(refresh_token),
    },
    next: { tags: ['campos'] },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Campo[] | Error = await res.json();

  if (!res.ok) return new Error((data as Error)?.message);

  return data as Campo[];
};

export const addCampo = async (payload: Campo, access_token: string) => {
  const PATH = `${API_URL}/v1/campos`;
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
  const data: Campo | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as Campo;
};

export const editCampo = async (payload: Campo, access_token: string) => {
  const PATH = `${API_URL}/v1/campos`;
  const OPTIONS: RequestInit = {
    method: 'PATCH',
    credentials: 'include',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Campo | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as Campo;
};

export const deleteCampo = async (id: UUID, access_token: string) => {
  const PATH = `${API_URL}/v1/campos`;
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
  const data: { count: number } | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as { count: number };
};

export const deleteLote = async (id: UUID, access_token: string) => {
  const PATH = `${API_URL}/v1/campos/lote`;
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
  const data: { count: number } | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as { count: number };
};
