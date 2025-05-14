import { AllDataRegister, PendingSync, Session } from './models';
import Dexie, { Table } from 'dexie';

import { Campo } from '@/types/campos.types';
import { Cultivo } from '@/types/cultivos.types';
import { Producto } from '@/types/productos.types';
import { Pulverizacion } from '@/types/pulverizaciones.types';
import { Tratamiento } from '@/types/tratamientos.types';

class PulveSysDB extends Dexie {
  pulverizaciones!: Table<{ id?: number; data: Pulverizacion }>;
  campos!: Table<{ id?: number; data: Campo }>;
  productos!: Table<{ id?: number; data: Producto }>;
  cultivos!: Table<{ id?: number; data: Cultivo }>;
  tratamientos!: Table<{ id?: number; data: Tratamiento }>;
  allData!: Table<AllDataRegister>;
  pendingSync!: Table<PendingSync>;
  session!: Table<Session>;

  constructor() {
    super('PulveSysDB');
    this.version(2).stores({
      pulverizaciones: '++id, &[data.id]',
      campos: '++id',
      productos: '++id',
      cultivos: '++id',
      tratamientos: '++id',
      allData: '++id, timestamp',
      pendingSync: '++id, createdAt',
      session: '++id, lastValidated',
    });
  }
}

export const db = new PulveSysDB();
