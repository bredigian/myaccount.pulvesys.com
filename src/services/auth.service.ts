import {
  Sesion,
  Usuario,
  UsuarioToSignin,
  UsuarioToSignup,
} from '@/types/usuario.types';

import { APIError } from '@/types/error.types';
import { API_URL } from '@/config/api';
import { Token } from '@/types/auth.types';

// Servicio utilizado tanto para signup como para agregar un nuevo usuario como EMPRESA
export const signup = async (
  payload: UsuarioToSignup,
  customPath?: string,
  access_token?: string,
) => {
  const OPTIONS: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: !access_token
      ? {
          'Content-Type': 'application/json',
        }
      : {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
    credentials: 'include',
  };
  const PATH = `${API_URL}/v1/${customPath ?? 'auth/signup'}`;

  const res = await fetch(PATH, OPTIONS);
  const data: Sesion | Usuario | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return customPath ? (data as Usuario) : (data as Sesion);
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
