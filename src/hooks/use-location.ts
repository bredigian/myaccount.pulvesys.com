import { useEffect, useState } from 'react';

import { Coordinada } from '@/types/locations.types';
import { toast } from 'sonner';

export const useGeoLocation = () => {
  const [geoLocation, setGeoLocation] = useState<
    Coordinada | null | { error: string }
  >(null);

  const getGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setGeoLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        } as Coordinada),
      (e) => {
        toast.warning(
          'Necesitamos de tus permisos para obtener la ubicación.',
          {
            position: 'top-center',
          },
        );
        setGeoLocation({ error: e.message } as { error: string });
      },
    );
  };

  useEffect(() => {
    if (navigator.geolocation) getGeolocation();
  }, []);

  return { geoLocation, getGeolocation };
};
