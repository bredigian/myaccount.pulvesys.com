import { PendingSync, Session } from './models';
import Dexie, { type EntityTable } from 'dexie';

const db = new Dexie('PulveSysDatabase') as Dexie & {
  pendingSync: EntityTable<PendingSync, 'id'>;
  session: EntityTable<Session, 'id'>;
};

db.version(1).stores({
  pendingSync: '++id, timestamp',
  session: '++id, lastValidated',
});

export { db };
