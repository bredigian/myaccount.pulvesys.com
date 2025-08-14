import { APIError } from '@/types/error.types';
import { API_URL } from '@/config/api';
import { Token } from '@/types/auth.types';
import { Treatment } from '@/types/treatments.types';
import { UUID } from 'crypto';

export const getTreatments = async (
  access_token: string,
  refresh_token: Token,
) => {
  const PATH = `${API_URL}/v1/tratamientos`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${access_token}`,
      Cookie: JSON.stringify(refresh_token),
    },
    next: { tags: ['tratamientos'] },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Treatment[] | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Treatment[];
};

export const addTreatment = async (
  payload: Treatment,
  access_token: string,
) => {
  const PATH = `${API_URL}/v1/tratamientos`;
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
  const data: Treatment | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Treatment;
};

export const editTreatment = async (
  payload: Treatment,
  access_token: string,
) => {
  const PATH = `${API_URL}/v1/tratamientos`;
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
  const data: Treatment | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Treatment;
};

export const deleteTreatment = async (id: UUID, access_token: string) => {
  const PATH = `${API_URL}/v1/tratamientos`;
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
