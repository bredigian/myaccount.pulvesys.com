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
  getData: () => Promise<void>;

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

  getData: async () => {
    set({ loading: true });

    const campos = await getCampos();
    const cultivos = await getCultivos();
    const productos = await getProductos();
    const tratamientos = await getTratamientos();

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
