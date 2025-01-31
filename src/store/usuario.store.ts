import { Usuario } from '@/types/usuario.types';
import { create } from 'zustand';

interface UsuarioStore extends Usuario {
  setUserdata: (userdata: Usuario) => void;
  clearUserdata: () => void;
}

export const usuarioStore = create<UsuarioStore>((set) => ({
  nombre_usuario: null,
  nombre: null,
  apellido: null,

  setUserdata(userdata: Partial<Usuario>) {
    set({
      nombre_usuario: userdata.nombre_usuario,
      nombre: userdata.nombre,
      apellido: userdata.apellido,
    });
  },

  clearUserdata() {
    set({ nombre_usuario: null, nombre: null, apellido: null });
  },
}));
