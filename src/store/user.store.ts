import { ROLES, User } from '@/types/users.types';

import { Subscription } from '@/types/subscriptions.types';
import { create } from 'zustand';

interface UserStore {
  nombre_usuario: string | null;
  nombre: string | null;
  apellido: string | null;
  rol: keyof typeof ROLES | null;
  isEmployer: boolean | null;
  suscripcion: Partial<Subscription> | null;
  setUserdata: (userdata: User) => void;
  clearUserdata: () => void;
}

export const userStore = create<UserStore>((set) => ({
  nombre_usuario: null,
  nombre: null,
  apellido: null,
  rol: null,
  isEmployer: null,
  suscripcion: null,

  setUserdata(userdata: Partial<User>) {
    set({
      nombre_usuario: userdata.nombre_usuario,
      nombre: userdata.nombre,
      apellido: userdata.apellido,
      rol: userdata.rol,
      isEmployer: userdata.isEmployer,
      suscripcion: userdata.suscripcion,
    });
  },

  clearUserdata() {
    set({
      nombre_usuario: null,
      nombre: null,
      apellido: null,
      rol: null,
      isEmployer: null,
      suscripcion: null,
    });
  },
}));
