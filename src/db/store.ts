import { API_URL } from '@/config/api';
import { AllData } from '@/types/root.types';
import { Campo } from '@/types/campos.types';
import { Cultivo } from '@/types/cultivos.types';
import { DataType } from './models';
import { Producto } from '@/types/productos.types';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import { Tratamiento } from '@/types/tratamientos.types';
import { Usuario } from '@/types/usuario.types';
import { db } from '.';

export const PulverizacionStore = {
  getAll: async () => await db.pulverizaciones.toArray(),
  saveOne: async (data: Pulverizacion) =>
    await db.pulverizaciones.add({ data }),
  getById: async (id: Pulverizacion['id']) =>
    await db.pulverizaciones.where('[data.id]').equals(id!).first(),
  clearAll: async () => await db.pulverizaciones.clear(),
};

export const CamposStore = {
  getAll: async () => await db.campos.toArray(),
  saveOne: async (data: Campo) => await db.campos.add({ data }),
  clearAll: async () => await db.campos.clear(),
};

export const ProductosStore = {
  getAll: async () => await db.productos.toArray(),
  saveOne: async (data: Producto) => await db.productos.add({ data }),
  clearAll: async () => await db.productos.clear(),
};

export const CultivosStore = {
  getAll: async () => await db.cultivos.toArray(),
  saveOne: async (data: Cultivo) => await db.cultivos.add({ data }),
  clearAll: async () => await db.cultivos.clear(),
};

export const TratamientosStore = {
  getAll: async () => await db.tratamientos.toArray(),
  saveOne: async (data: Tratamiento) => await db.tratamientos.add({ data }),
  clearAll: async () => await db.tratamientos.clear(),
};

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

export const AllDataStore = {
  save: async (data: AllData) => {
    await db.allData.clear();
    await db.allData.add({ data, timestamp: Date.now() });
  },
  getAll: async () => await db.allData.toArray(),
};

export const SessionStore = {
  get: async () => await db.session.toArray().then((arr) => arr[0] || null),
  save: async (token: string, userdata: Usuario, expiresAt: number) => {
    await db.session.clear(); // Solo una sesión activa
    return await db.session.add({
      token,
      userdata,
      expiresAt,
      lastValidated: Date.now(),
    });
  },
  clear: async () => await db.session.clear(),
};
