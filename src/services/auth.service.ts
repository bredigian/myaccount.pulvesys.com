import { Sesion, UsuarioToSignin } from '@/types/usuario.types';

import { API_URL } from '@/config/api';
import { Token } from '@/types/auth.types';

export const signin = async (payload: UsuarioToSignin) => {
  const OPTIONS: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };
  const PATH = `${API_URL}/v1/auth/signin`;

  const res = await fetch(PATH, OPTIONS);
  const data = await res.json();

  if (!res.ok) throw new Error((data as Error).message);

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
  const data = await res.json();
  if (!res.ok) return new Error((data as Error).message);

  return data as Sesion;
};

export const signout = async (token: string) => {
  const options: RequestInit = {
    method: 'DELETE',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };
  const PATH = `${API_URL}/v1/auth/sesion`;

  const res = await fetch(PATH, options);
  const data = await res.json();
  if (!res.ok) throw new Error((data as Error).message);

  return { ok: true };
};
