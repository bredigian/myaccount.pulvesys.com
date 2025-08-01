'use client';

import { Campo, Coordinada, Lote } from '@/types/campos.types';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  DrawCreateEvent,
  DrawDeleteEvent,
  DrawUpdateEvent,
} from '@mapbox/mapbox-gl-draw';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './ui/drawer';
import { FieldErrors, useForm } from 'react-hook-form';
import { addCampo, editCampo } from '@/services/campos.service';
import { area, convertArea } from '@turf/turf';
import { useCallback, useEffect, useState } from 'react';

import { APIError } from '@/types/error.types';
import { Button } from './ui/button';
import { Check } from 'lucide-react';
import ColorPicker from './color-picker';
import Cookies from 'js-cookie';
import { Input } from './ui/input';
import MapboxMap from './map';
import { Position } from 'geojson';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Skeleton } from './ui/skeleton';
import { UUID } from 'crypto';
import { cn } from '@/lib/utils';
import revalidate from '@/lib/actions';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/use-dialog';
import { useGeoLocation } from '@/hooks/use-location';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';

interface PolygonProperties {
  nombre?: string;
  color?: string;
  area?: number;
  description?: string;
  opacity?: number;
}
export type PolygonFeature = GeoJSON.Feature<
  GeoJSON.Polygon,
  PolygonProperties
>;

export default function AddOrEditCampoForm({
  isEdit,
  data,
  handleOpen,
  storedData,
}: {
  isEdit?: boolean;
  data?: Campo;
  storedData?: Campo[];
  handleOpen: () => void;
}) {
  const { push } = useRouter();
  const { geoLocation, getGeolocation } = useGeoLocation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Campo>({
    defaultValues: isEdit ? { nombre: data?.nombre } : undefined,
  });

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<
    boolean | undefined
  >(undefined);

  const onInvalidSubmit = (errors: FieldErrors<Campo>) => {
    if (errors.nombre)
      toast.error(errors.nombre.message, {
        position: 'top-center',
      });
  };

  const onSubmit = async (values: Campo) => {
    try {
      if (polygons.length === 0) {
        toast.error('No es posible agregar un campo sin lotes', {
          position: 'top-center',
        });

        return;
      }

      const coordenadas = polygons.map((p) => p.geometry.coordinates);

      const lotes: Lote[] = polygons.map((i) => {
        return {
          id: typeof i.id === 'number' ? i.id.toString() : i.id,
          nombre: i.properties.nombre as string,
          hectareas: i.properties.area as number,
          color: i.properties.color as string,
          zona: coordenadas
            .filter((c) => c === i.geometry.coordinates)[0][0]
            .map((a) => ({
              id: !isEdit
                ? undefined
                : typeof a[2] === 'number'
                  ? a[2].toString()
                  : a[2],
              lng: a[0],
              lat: a[1],
            })),
        };
      });

      const PAYLOAD: Campo = {
        ...values,
        id: data?.id,
        Lote: lotes,
        polygonsToDelete: !isEdit ? undefined : polygonsToDelete,
      };

      const access_token = Cookies.get('access_token');
      if (!access_token) {
        toast.error('La sesión ha expirado', { position: 'top-center' });
        push('/');

        return;
      }

      if (!isEdit) await addCampo(PAYLOAD, access_token);
      else await editCampo(PAYLOAD, access_token);

      setIsSubmitSuccessful(true);
      setTimeout(() => handleOpen(), 1000);

      await revalidate('campos');
    } catch (error) {
      const { statusCode, message } = error as APIError;

      toast.error(message, { position: 'top-center' });
      const unauthorized = statusCode === 401 || statusCode === 403;
      if (unauthorized) setTimeout(() => push('/'), 250);
    }
  };

  const [polygonsToDelete, setPolygonsToDelete] = useState<string[]>([]);

  const [polygons, setPolygons] = useState<PolygonFeature[]>(
    !isEdit
      ? []
      : (data?.Lote as Lote[]).map((l) => {
          const points = l.Coordinada as Coordinada[];

          const groupedByLoteId = points.reduce(
            (acc, coord) => {
              const { id, lng, lat, lote_id } = coord as Required<Coordinada>;
              if (!acc[lote_id]) acc[lote_id] = [];

              acc[lote_id].push([lng, lat, id as unknown as number]);
              return acc;
            },
            {} as Record<string, Position[]>,
          );

          return {
            id: l.id as UUID,
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: Object.values(groupedByLoteId),
            },
            properties: {
              description: `${l.nombre} (${l.hectareas?.toFixed(2)}ha)`,
              area: l.hectareas,
              nombre: l.nombre,
              color: l.color,
              opacity: 0.65,
            },
          } as PolygonFeature;
        }),
  );

  const storedPolygons: PolygonFeature[][] =
    storedData?.map((c) =>
      (c.Lote as Lote[]).map((l) => {
        const points = l.Coordinada as Coordinada[];

        const groupedByLoteId = points.reduce(
          (acc, coord) => {
            const { lng, lat, lote_id } = coord as Required<Coordinada>;
            if (!acc[lote_id]) acc[lote_id] = [];

            acc[lote_id].push([lng, lat]);
            return acc;
          },
          {} as Record<string, Position[]>,
        );

        return {
          id: l.id as UUID,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: Object.values(groupedByLoteId),
          },
          properties: {
            description: `${l.nombre} (${l.hectareas?.toFixed(2)}ha)\n${c.nombre}`,
            area: l.hectareas,
            nombre: l.nombre,
            color: l.color,
            opacity: 0.65,
          },
        } as PolygonFeature;
      }),
    ) ?? [];

  const { open, setOpen, handleOpen: handleNewPolygonDialog } = useDialog();
  const [newPolygon, setNewPolygon] = useState<PolygonFeature | null>(null);
  const [polygonName, setPolygonName] = useState('');
  const [polygonColor, setPolygonColor] = useState('#ff0000');

  const onCreate = useCallback((e: DrawCreateEvent) => {
    const newPolygon = e.features[0];
    setNewPolygon(newPolygon as PolygonFeature);
    handleNewPolygonDialog();

    e.target.dragPan.enable();
    e.target.touchZoomRotate.enable();
    e.target.touchPitch.enable();
  }, []);

  const onHandlePolygonInformation = () => {
    if (newPolygon && polygonName) {
      if (polygonName.length < 2) {
        toast.error('El nombre debe contener al menos 2 caracteres.');
        return;
      }

      const polygonArea = convertArea(
        area(newPolygon.geometry),
        'meters',
        'hectares',
      );

      const updatedPolygon: PolygonFeature = {
        ...newPolygon,
        properties: {
          ...newPolygon.properties,
          nombre: polygonName,
          color: polygonColor,
          area: polygonArea,
          description: `${polygonName} (${polygonArea.toFixed(2)}ha)`,
          opacity: 0.65,
        },
      };
      setPolygons((prev) => [...prev, updatedPolygon]);
      handleNewPolygonDialog();
      setPolygonName('');
      setNewPolygon(null);
    }
  };

  const onUpdate = useCallback((e: DrawUpdateEvent) => {
    setPolygons((prev) =>
      prev.map((p) => {
        const updatedFeature = e.features.find((f) => f.id === p.id);
        if (updatedFeature && updatedFeature.geometry.type === 'Polygon') {
          const polygonArea = convertArea(
            area(updatedFeature.geometry),
            'meters',
            'hectares',
          );

          return {
            ...updatedFeature,
            properties: {
              ...p.properties,
              ...(updatedFeature.properties || {}),
              area: polygonArea,
              description: `${p.properties.nombre} (${polygonArea.toFixed(2)}ha)`,
            },
          } as PolygonFeature;
        }
        return p;
      }),
    );
    e.target.dragPan.enable();
    e.target.touchZoomRotate.enable();
    e.target.touchPitch.enable();
  }, []);

  const onDelete = useCallback((e: DrawDeleteEvent) => {
    const deletedIds = e.features.map((f) => f.id);
    setPolygons((prev) => prev.filter((p) => !deletedIds.includes(p.id)));

    for (const id of deletedIds) {
      if (
        data?.Lote?.some((st) => st.id === id) &&
        !polygonsToDelete.includes(id as string)
      )
        setPolygonsToDelete((prev) => [...prev, id as string]);
    }

    e.target.dragPan.enable();
    e.target.touchZoomRotate.enable();
    e.target.touchPitch.enable();
  }, []);

  const isMobile = useIsMobile();

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        handleSubmit(onSubmit, onInvalidSubmit)(e);
      }}
      className='flex flex-col gap-4 px-4 pb-4 md:px-0 md:pb-0'
      id='form-add-campos'
      data-vaul-no-drag
    >
      <Input
        {...register('nombre', {
          minLength: {
            value: 4,
            message: 'Debe contener al menos 4 caracteres.',
          },
          required: { value: true, message: 'El nombre es requerido.' },
        })}
        placeholder='Nombre'
        className='text-sm md:text-base'
      />
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Lote</DrawerTitle>
              <DrawerDescription>
                El nombre debe contener al menos 2 caracteres. Además, podés
                elegír el color que más te guste
              </DrawerDescription>
            </DrawerHeader>
            <div className='flex h-9 items-center gap-4 px-4'>
              <Input
                id='new-polygon-name'
                value={polygonName}
                onChange={(e) => setPolygonName(e.target.value)}
                placeholder='Ej: Lote 1'
                className='text-sm'
              />
              <ColorPicker
                color={polygonColor}
                onChange={(color) => setPolygonColor(color)}
              />
            </div>
            <DrawerFooter>
              <Button
                disabled={polygonName.length < 2}
                onClick={onHandlePolygonInformation}
              >
                Guardar
              </Button>
              <DrawerClose asChild>
                <Button variant={'outline'}>Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lote</DialogTitle>
              <DialogDescription>
                El nombre debe contener al menos 2 caracteres. Además, podés
                elegír el color que más te guste
              </DialogDescription>
            </DialogHeader>
            <div className='flex h-9 items-center gap-4'>
              <Input
                id='new-polygon-name'
                value={polygonName}
                onChange={(e) => setPolygonName(e.target.value)}
                placeholder='Ej: Lote 1'
                className='text-sm'
              />
              <ColorPicker
                color={polygonColor}
                onChange={(color) => setPolygonColor(color)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={'outline'}>Cancelar</Button>
              </DialogClose>
              <Button
                disabled={polygonName.length < 2}
                onClick={onHandlePolygonInformation}
              >
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <p className='max-w-72 self-end text-end text-xs opacity-50'>
        *Marcá los puntos y cerrá el área seleccionando el primer o último punto
        que marcaste.
      </p>
      <div className='flex h-[60dvh] w-full flex-col gap-4 overflow-y-auto md:justify-between'>
        {!geoLocation ? (
          <div className='relative h-full !grow rounded-lg bg-primary-foreground'>
            <Skeleton className='size-full' />
          </div>
        ) : (
          <MapboxMap
            key={data?.Lote?.length}
            size='!grow'
            onCreate={onCreate}
            onUpdate={onUpdate}
            onDelete={onDelete}
            polygons={polygons}
            storedPolygons={storedPolygons.flat()}
            polygonInDrawing={newPolygon}
            currentGeolocation={geoLocation}
          />
        )}
      </div>
      <div className='flex flex-col items-center gap-2 md:flex-row-reverse md:items-end'>
        <Button
          disabled={isSubmitting || isSubmitSuccessful}
          type='submit'
          className={cn(
            'w-full md:w-fit',
            !isSubmitSuccessful
              ? 'bg-primary'
              : '!bg-green-700 text-primary-foreground disabled:opacity-100 dark:text-primary',
          )}
          form='form-add-campos'
        >
          {isSubmitSuccessful ? (
            <>
              Completado <Check />
            </>
          ) : !isSubmitting ? (
            !isEdit ? (
              'Agregar'
            ) : (
              'Modificar'
            )
          ) : (
            <>
              Procesando
              <ReloadIcon className='animate-spin' />
            </>
          )}
        </Button>
        <Button
          type='button'
          variant={'outline'}
          onClick={handleOpen}
          className='w-full md:w-fit'
        >
          Cerrar
        </Button>
      </div>
    </form>
  );
}
