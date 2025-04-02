import { APIError } from '@/types/error.types';
import { API_URL } from '@/config/api';
import { Plan } from '@/types/planes.types';

export const getPlanes = async () => {
  const PATH = `${API_URL}/v1/planes`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    credentials: 'include',
    next: { tags: ['planes'] },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Plan[] | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Plan[];
};
