import { APIError } from '@/types/error.types';
import { API_URL } from '@/config/api';
import { ApplicationWithConsume } from '@/types/applications.types';
import { Spray } from '@/types/sprays.types';
import { Token } from '@/types/auth.types';
import { UUID } from 'crypto';

export const getSprays = async (access_token: string, refresh_token: Token) => {
  const PATH = `${API_URL}/v1/pulverizaciones`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${access_token}`,
      Cookie: JSON.stringify(refresh_token),
    },
    next: { tags: ['pulverizaciones'] },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Spray[] | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Spray[];
};

export const getSprayByID = async (
  id: Spray['id'],
  access_token: string,
  refresh_token: Token,
) => {
  const PATH = `${API_URL}/v1/pulverizaciones/detalle?id=${id}`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${access_token}`,
      Cookie: JSON.stringify(refresh_token),
    },
    next: { tags: ['pulverizaciones'] },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Spray | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Spray;
};

export const addSpray = async (payload: Spray, access_token: string) => {
  const PATH = `${API_URL}/v1/pulverizaciones`;
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
  const data: Spray | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Spray;
};

export const editSpray = async (payload: Spray, access_token: string) => {
  const PATH = `${API_URL}/v1/pulverizaciones`;
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
  const data: Spray | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Spray;
};

export const editApplicationConsume = async (
  payload: ApplicationWithConsume,
  access_token: string,
) => {
  const PATH = `${API_URL}/v1/pulverizaciones/aplicacion`;
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
  const data: Spray | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Spray;
};

export const deleteSpray = async (id: UUID, access_token: string) => {
  const PATH = `${API_URL}/v1/pulverizaciones`;
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
