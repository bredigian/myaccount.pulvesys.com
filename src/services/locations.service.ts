import { APIError } from '@/types/error.types';
import { API_URL } from '@/config/api';
import { Location } from '@/types/locations.types';
import { Token } from '@/types/auth.types';
import { UUID } from 'crypto';

export const getLocations = async (
  access_token: string,
  refresh_token: Token,
) => {
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
  const data: Location[] | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Location[];
};

export const addLocation = async (payload: Location, access_token: string) => {
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
  const data: Location | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Location;
};

export const editLocation = async (payload: Location, access_token: string) => {
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
  const data: Location | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Location;
};

export const deleteLocation = async (id: UUID, access_token: string) => {
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
  const data: { count: number } | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as { count: number };
};

export const deleteLot = async (id: UUID, access_token: string) => {
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
  const data: { count: number } | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as { count: number };
};
