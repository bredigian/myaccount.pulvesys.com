import { API_URL } from '@/config/api';
import { Campo } from '@/types/campos.types';
import { Cultivo } from '@/types/cultivos.types';
import { DataType } from './models';
import { Producto } from '@/types/productos.types';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import { Tratamiento } from '@/types/tratamientos.types';
import { Usuario } from '@/types/usuario.types';
import { db } from '.';

export const PendingSyncStore = {
  getAll: async () => await db.pendingSync.toArray(),
  saveOne: async (
    data: Pulverizacion | Campo | Producto | Cultivo | Tratamiento,
    type: DataType,
    endpoint: string,
    method: string,
  ) =>
    await db.pendingSync.add({
      data,
      type,
      endpoint: `${API_URL}${endpoint}`,
      method,
      createdAt: Date.now(),
    }),
  deleteOne: async (id: number) => await db.pendingSync.delete(id),
};

export const SessionStore = {
  get: async () => await db.session.toArray().then((arr) => arr[0] || null),
  save: async (token: string, userdata: Usuario, expiresAt: number) => {
    await db.session.clear();
    return await db.session.add({
      token,
      userdata,
      expiresAt,
      lastValidated: Date.now(),
    });
  },
  clear: async () => await db.session.clear(),
};
