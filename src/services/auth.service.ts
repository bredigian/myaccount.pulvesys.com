import { Sesion, UsuarioToSignin } from '@/types/usuario.types';

import { API_URL } from '@/config/api';
import { APIError } from '@/types/error.types';

export const signin = async (payload: UsuarioToSignin) => {
  const OPTIONS: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  };
  const PATH = `${API_URL}/v1/auth/signin`;

  const res = await fetch(PATH, OPTIONS);
  const data: Sesion | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Sesion;
};

export const verifySesion = async (token: string) => {
  const options: RequestInit = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ['sesion'], revalidate: 3600 },
  };
  const PATH = `${API_URL}/v1/auth/sesion`;

  const res = await fetch(PATH, options);
  const data: Sesion | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Sesion;
};

interface SignoutResponse {
  ok: boolean;
}

export const signout = async (token: string) => {
  const options: RequestInit = {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  };
  const PATH = `${API_URL}/v1/auth/sesion`;

  const res = await fetch(PATH, options);
  const data: SignoutResponse | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return { ok: true } as SignoutResponse;
};
