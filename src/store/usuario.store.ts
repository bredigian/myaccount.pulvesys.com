import { ROLES, Usuario } from '@/types/usuario.types';

import { Suscripcion } from '@/types/suscripciones.types';
import { create } from 'zustand';

interface UsuarioStore {
  nombre_usuario: string | null;
  nombre: string | null;
  apellido: string | null;
  rol: keyof typeof ROLES | null;
  isEmployer: boolean | null;
  suscripcion: Partial<Suscripcion> | null;
  setUserdata: (userdata: Usuario) => void;
  clearUserdata: () => void;
}

export const usuarioStore = create<UsuarioStore>((set) => ({
  nombre_usuario: null,
  nombre: null,
  apellido: null,
  rol: null,
  isEmployer: null,
  suscripcion: null,

  setUserdata(userdata: Partial<Usuario>) {
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
