import { Campo } from '@/types/campos.types';
import { Cultivo } from '@/types/cultivos.types';
import { Producto } from '@/types/productos.types';
import { Tratamiento } from '@/types/tratamientos.types';
import { create } from 'zustand';
import { getCampos } from '@/services/campos.service';
import { getCultivos } from '@/services/cultivos.service';
import { getProductos } from '@/services/productos.service';
import { getTratamientos } from '@/services/tratamientos.service';

interface DataStore {
  campos: Campo[] | null;
  productos: Producto[] | null;
  cultivos: Cultivo[] | null;
  tratamientos: Tratamiento[] | null;
  getCampos: (access_token: string) => Promise<void>;
  getProductos: (access_token: string) => Promise<void>;
  getCultivos: (access_token: string) => Promise<void>;
  getTratamientos: (access_token: string) => Promise<void>;

  getData: (access_token: string) => Promise<void>;

  loading: boolean | null;
  error: boolean | null;

  isAlreadyFetching: () => boolean;
}

export const useDataStore = create<DataStore>((set, get) => ({
  campos: null,
  cultivos: null,
  productos: null,
  tratamientos: null,

  loading: null,
  error: null,

  isAlreadyFetching: () => {
    if (
      !get().campos &&
      !get().cultivos &&
      !get().productos &&
      !get().tratamientos
    )
      return false;
    else return true;
  },

  getCampos: async (access_token: string) => {
    const campos = await getCampos(access_token);
    if (campos instanceof Error) {
      set({ error: true });
      return;
    }
    set({ campos });
  },
  getProductos: async (access_token: string) => {
    const productos = await getProductos(access_token);
    if (productos instanceof Error) {
      set({ error: true });
      return;
    }
    set({ productos });
  },
  getCultivos: async (access_token: string) => {
    const cultivos = await getCultivos(access_token);
    if (cultivos instanceof Error) {
      set({ error: true });
      return;
    }
    set({ cultivos });
  },
  getTratamientos: async (access_token: string) => {
    const tratamientos = await getTratamientos(access_token);
    if (tratamientos instanceof Error) {
      set({ error: true });
      return;
    }
    set({ tratamientos });
  },

  getData: async (access_token: string) => {
    set({ loading: true });

    const campos = await getCampos(access_token);
    const cultivos = await getCultivos(access_token);
    const productos = await getProductos(access_token);
    const tratamientos = await getTratamientos(access_token);

    if (
      campos instanceof Error ||
      cultivos instanceof Error ||
      productos instanceof Error ||
      tratamientos instanceof Error
    ) {
      set({ error: true, loading: false });
      return;
    }

    set({ campos, cultivos, productos, tratamientos, loading: false });
  },
}));
