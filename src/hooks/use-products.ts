import { Application } from '@/types/applications.types';
import { UUID } from 'crypto';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';

export const useControllerApplications = () => {
  const storedAplicaciones = localStorage.getItem('aplicaciones_temporal');

  const [aplicaciones, setAplicaciones] = useState<Application[]>(
    !storedAplicaciones ? [{} as Application] : JSON.parse(storedAplicaciones),
  );

  const addAplicacion = () =>
    setAplicaciones((prev) => [...prev, {} as Application]);

  const deleteAplicacion = () => setAplicaciones((prev) => prev.slice(0, -1));

  const handleChangeSelectValue = (value: string, index: number) => {
    const updatedItems: Application[] = aplicaciones.map((item, i) => ({
      producto_id: index === i ? (value as UUID) : item.producto_id,
      dosis: item.dosis,
    }));

    setAplicaciones(updatedItems);
  };

  const handleUpdateAplicacionesOnLocalStorage = () =>
    localStorage.setItem('aplicaciones_temporal', JSON.stringify(aplicaciones));

  const handleChangeAplicacionDosis = useDebouncedCallback(
    (value: number, id: string) => {
      setAplicaciones((prev) =>
        prev.map((item) => {
          return {
            producto_id: item.producto_id,
            dosis: item.producto_id === id ? value : item.dosis,
          };
        }),
      );
    },
    300,
  );

  const areEmptySelectedProducts = aplicaciones.some((aplicacion) =>
    !aplicacion.producto_id || !aplicacion.dosis ? true : false,
  );

  const clearAll = () => setAplicaciones([{} as Application]);

  return {
    aplicaciones,
    addAplicacion,
    deleteAplicacion,
    handleChangeSelectValue,
    handleUpdateAplicacionesOnLocalStorage,
    handleChangeAplicacionDosis,
    areEmptySelectedProducts,
    clearAll,
  };
};
