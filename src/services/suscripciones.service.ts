import {
  PayloadInitPoint,
  SUBSCRIPTION_MESSAGE,
  Suscripcion,
} from '@/types/suscripciones.types';

import { APIError } from '@/types/error.types';
import { API_URL } from '@/config/api';
import { Token } from '@/types/auth.types';

export const getSuscripcion = async (
  access_token: string,
  refresh_token: Token,
) => {
  const PATH = `${API_URL}/v1/suscripciones`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${access_token}`,
      Cookie: JSON.stringify(refresh_token),
    },
    next: { tags: ['suscripciones'] },
    cache: 'no-cache',
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Suscripcion | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Suscripcion;
};

export const generateInitPoint = async (
  payload: PayloadInitPoint,
  access_token: string,
) => {
  const PATH = `${API_URL}/v1/suscripciones`;
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
  const data: { init_point: string } | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as { init_point: string };
};

export const handleInformationMessage = async (
  message_info: keyof typeof SUBSCRIPTION_MESSAGE,
  access_token: string,
) => {
  const PATH = `${API_URL}/v1/suscripciones/mensaje`;
  const OPTIONS: RequestInit = {
    method: 'PATCH',
    credentials: 'include',
    body: JSON.stringify({ message_info }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Suscripcion | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Suscripcion;
};

export const unsuscribe = async (access_token: string) => {
  const PATH = `${API_URL}/v1/suscripciones`;
  const OPTIONS: RequestInit = {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: { ok: boolean } | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as { ok: boolean };
};
