import { UpdateUserProps, User, UserToSignup } from '@/types/users.types';

import { APIError } from '@/types/error.types';
import { API_URL } from '@/config/api';
import { Token } from '@/types/auth.types';
import { signup } from './auth.service';

export const getUsersByEnterpriseID = async (
  access_token: string,
  refresh_token: Token,
) => {
  const PATH = `${API_URL}/v1/usuarios/empresa`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${access_token}`,
      Cookie: JSON.stringify(refresh_token),
    },
    next: { tags: ['usuarios'] },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: User[] | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as User[];
};

// Reutiliza la funcion de "signup" pero con otro PATH
export const addUser = async (payload: UserToSignup, access_token: string) =>
  await signup(payload, 'usuarios/empresa', access_token);

export const editUser = async (
  payload: UpdateUserProps,
  access_token: string,
) => {
  const PATH = `${API_URL}/v1/usuarios/empresa`;
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
  const data: User | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as User;
};

export const deleteUser = async (id: User['id'], access_token: string) => {
  const PATH = `${API_URL}/v1/usuarios/empresa`;
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
