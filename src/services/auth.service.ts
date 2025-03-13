import {
  Sesion,
  UsuarioToSignin,
  UsuarioToSignup,
} from '@/types/usuario.types';

import { API_URL } from '@/config/api';
import { Token } from '@/types/auth.types';
import { APIError } from '@/types/error.types';

export const signup = async (payload: UsuarioToSignup) => {
  const OPTIONS: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };
  const PATH = `${API_URL}/v1/auth/signup`;

  const res = await fetch(PATH, OPTIONS);
  const data: Sesion | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Sesion;
};

export const signin = async (payload: UsuarioToSignin) => {
  const OPTIONS: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };
  const PATH = `${API_URL}/v1/auth/signin`;

  const res = await fetch(PATH, OPTIONS);
  const data: Sesion | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Sesion;
};

export const verifySesion = async (
  access_token: string,
  refresh_token: Token,
) => {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${access_token}`,
      Cookie: JSON.stringify(refresh_token),
    },
    cache: 'no-cache',
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
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };
  const PATH = `${API_URL}/v1/auth/sesion`;

  const res = await fetch(PATH, options);
  const data: SignoutResponse | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return { ok: true } as SignoutResponse;
};
