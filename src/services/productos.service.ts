import { API_URL } from '@/config/api';
import { Token } from '@/types/auth.types';
import { Producto } from '@/types/productos.types';
import { UUID } from 'crypto';

export const getProductos = async (
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
  const data: Producto[] | Error = await res.json();

  if (!res.ok) return new Error((data as Error)?.message);

  return data as Producto[];
};

export const addProducto = async (payload: Producto, access_token: string) => {
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
  const data: Producto | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as Producto;
};

export const editProducto = async (payload: Producto, access_token: string) => {
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
  const data: Producto | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as Producto;
};

export const deleteProducto = async (id: UUID, access_token: string) => {
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
  const data: { count: number } | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as { count: number };
};
