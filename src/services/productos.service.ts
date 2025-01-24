import { API_URL } from '@/config/api';
import { Producto } from '@/types/productos.types';
import { UUID } from 'crypto';

export const getProductos = async () => {
  const PATH = `${API_URL}/v1/productos`;
  const OPTIONS: RequestInit = { method: 'GET', next: { tags: ['productos'] } };

  const res = await fetch(PATH, OPTIONS);
  const data: Producto[] | Error = await res.json();

  if (!res.ok) return new Error((data as Error)?.message);

  return data as Producto[];
};

export const addProducto = async (payload: Producto) => {
  const PATH = `${API_URL}/v1/productos`;
  const OPTIONS: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Producto | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as Producto;
};

export const editProducto = async (payload: Producto) => {
  const PATH = `${API_URL}/v1/productos`;
  const OPTIONS: RequestInit = {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Producto | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as Producto;
};

export const deleteProducto = async (id: UUID) => {
  const PATH = `${API_URL}/v1/productos`;
  const OPTIONS: RequestInit = {
    method: 'DELETE',
    body: JSON.stringify({ id }),
    headers: { 'Content-Type': 'application/json' },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: { count: number } | Error = await res.json();

  if (!res.ok) throw new Error((data as Error)?.message);

  return data as { count: number };
};
