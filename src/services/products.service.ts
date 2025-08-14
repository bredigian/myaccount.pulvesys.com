import { APIError } from '@/types/error.types';
import { API_URL } from '@/config/api';
import { Product } from '@/types/products.types';
import { Token } from '@/types/auth.types';
import { UUID } from 'crypto';

export const getProducts = async (
  access_token: string,
  refresh_token: Token,
) => {
  const PATH = `${API_URL}/v1/productos`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${access_token}`,
      Cookie: JSON.stringify(refresh_token),
    },
    next: { tags: ['productos'] },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Product[] | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Product[];
};

export const addProduct = async (payload: Product, access_token: string) => {
  const PATH = `${API_URL}/v1/productos`;
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
  const data: Product | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Product;
};

export const editProduct = async (payload: Product, access_token: string) => {
  const PATH = `${API_URL}/v1/productos`;
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
  const data: Product | APIError = await res.json();
  if (!res.ok) throw data as APIError;

  return data as Product;
};

export const deleteProduct = async (id: UUID, access_token: string) => {
  const PATH = `${API_URL}/v1/productos`;
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
