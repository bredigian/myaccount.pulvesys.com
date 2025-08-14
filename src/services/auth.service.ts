import { Session, User, UserToSignin, UserToSignup } from '@/types/users.types';

import { APIError } from '@/types/error.types';
import { API_URL } from '@/config/api';
import { Token } from '@/types/auth.types';

// Servicio utilizado tanto para signup como para agregar un nuevo usuario como EMPRESA
export const signup = async (
  payload: UserToSignup,
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
  const data: Session | User | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return customPath ? (data as User) : (data as Session);
};

export const signin = async (payload: UserToSignin) => {
  const OPTIONS: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };
  const PATH = `${API_URL}/v1/auth/signin`;

  const res = await fetch(PATH, OPTIONS);
  const data: Session | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Session;
};

export const verifySession = async (
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
  const data: Session | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Session;
};

interface OKResponse {
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
  const data: OKResponse | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return { ok: true } as OKResponse;
};

export const generateRecoverPassword = async (email: User['email']) => {
  const options: RequestInit = {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ email }),
    headers: { 'Content-Type': 'application/json' },
  };
  const PATH = `${API_URL}/v1/auth/recuperar`;

  const res = await fetch(PATH, options);
  const data: OKResponse | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return { ok: true } as OKResponse;
};

export const verifyRecoverToken = async (token: string) => {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
    cache: 'no-cache',
  };
  const PATH = `${API_URL}/v1/auth/recuperar?token=${token}`;

  const res = await fetch(PATH, options);
  const data: OKResponse | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return { ok: true } as OKResponse;
};

export const resetPassword = async (
  token: string,
  payload: {
    contrasena: User['contrasena'];
  },
) => {
  const options: RequestInit = {
    method: 'PATCH',
    credentials: 'include',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const PATH = `${API_URL}/v1/auth/recuperar`;

  const res = await fetch(PATH, options);
  const data: OKResponse | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return { ok: true } as OKResponse;
};
