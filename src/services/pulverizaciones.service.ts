import { API_URL } from '@/config/api';
import { AplicacionConConsumo } from '@/types/aplicaciones.types';
import { Token } from '@/types/auth.types';
import { APIError } from '@/types/error.types';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import { UUID } from 'crypto';

export const getPulverizaciones = async (
  access_token: string,
  refresh_token: Token,
) => {
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
  const data: Pulverizacion[] | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Pulverizacion[];
};

export const getById = async (
  id: Pulverizacion['id'],
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
  const data: Pulverizacion | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Pulverizacion;
};

export const addPulverizacion = async (
  payload: Pulverizacion,
  access_token: string,
) => {
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
  const data: Pulverizacion | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Pulverizacion;
};

export const editPulverizacion = async (
  payload: Pulverizacion,
  access_token: string,
) => {
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
  const data: Pulverizacion | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Pulverizacion;
};

export const editAplicacionConsumo = async (
  payload: AplicacionConConsumo,
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
  const data: Pulverizacion | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Pulverizacion;
};

export const deletePulverizacion = async (id: UUID, access_token: string) => {
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
