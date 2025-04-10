import { APIError } from '@/types/error.types';
import { API_URL } from '@/config/api';
import { Log } from '@/types/historial.types';
import { Token } from '@/types/auth.types';

export const getHistorial = async (
  access_token: string,
  refresh_token: Token,
) => {
  const PATH = `${API_URL}/v1/historial`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${access_token}`,
      Cookie: JSON.stringify(refresh_token),
    },
    next: { tags: ['historial'] },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Log[] | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Log[];
};
