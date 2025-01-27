import { Aplicacion } from '@/types/aplicaciones.types';
import { UUID } from 'crypto';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';

export const useControllerAplicaciones = () => {
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([
    {} as Aplicacion,
  ]);

  const addAplicacion = () =>
    setAplicaciones((prev) => [...prev, {} as Aplicacion]);

  const deleteAplicacion = () => setAplicaciones((prev) => prev.slice(0, -1));

  const handleChangeSelectValue = (value: string, index: number) => {
    const updatedItems: Aplicacion[] = aplicaciones.map((item, i) => ({
      producto_id: index === i ? value : item.producto_id,
      dosis: item.dosis,
    }));

    setAplicaciones(updatedItems);
  };

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

  return {
    aplicaciones,
    addAplicacion,
    deleteAplicacion,
    handleChangeSelectValue,
    handleChangeAplicacionDosis,
    areEmptySelectedProducts,
  };
};
