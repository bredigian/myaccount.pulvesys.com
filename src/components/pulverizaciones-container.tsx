import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';

import AddOrEditPulverizacionForm from './pulverizaciones-form';
import { Button } from './ui/button';
import { Campo } from '@/types/campos.types';
import { Cultivo } from '@/types/cultivos.types';
import { Droplet } from 'lucide-react';
import { Producto } from '@/types/productos.types';
import { Tratamiento } from '@/types/tratamientos.types';
import { getCampos } from '@/services/campos.service';
import { getCultivos } from '@/services/cultivos.service';
import { getProductos } from '@/services/productos.service';
import { getPulverizaciones } from '@/services/pulverizaciones.service';
import { getTratamientos } from '@/services/tratamientos.service';

export const PulverizacionesContainer = async () => {
  const data = await getPulverizaciones();
  if (data instanceof Error) return <p>{data?.message}</p>;

  console.log(data);

  return (
    <ul>
      {data.map((pulverizacion) => (
        <li key={pulverizacion.id}>{pulverizacion.fecha.toString()}</li>
      ))}
    </ul>
  );
};
export const AddPulverizacionDialogContainer = async () => {
  const campos = await getCampos();
  const cultivos = await getCultivos();
  const productos = await getProductos();
  const tratamientos = await getTratamientos();

  if (!campos || !cultivos || !productos || !tratamientos)
    return (
      <Button variant={'outline'} disabled>
        Crear <Droplet />
      </Button>
    );

  return (
    <Drawer dismissible={false}>
      <DrawerTrigger asChild>
        {/* {!isEdit ? ( */}
        <Button>
          Crear
          <Droplet />
        </Button>
        {/* ) : ( */}
        {/* <Button size={'icon'} variant={'outline'}>
            <Edit />
          </Button> */}
        {/* )} */}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {/* {!isEdit ? 'Nueva pulverización' : 'Modificar pulverización'} */}
            Pulverizacion
          </DrawerTitle>
          <DrawerDescription>
            Completa con lo requerido para la pulverización
          </DrawerDescription>
        </DrawerHeader>
        <AddOrEditPulverizacionForm
          campos={campos as Campo[]}
          cultivos={cultivos as Cultivo[]}
          productos={productos as Producto[]}
          tratamientos={tratamientos as Tratamiento[]}
        />
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
