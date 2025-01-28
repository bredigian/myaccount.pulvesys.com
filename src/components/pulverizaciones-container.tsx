import PulverizacionItem from './pulverizacion-item';
import { getPulverizaciones } from '@/services/pulverizaciones.service';

export const PulverizacionesContainer = async () => {
  const data = await getPulverizaciones();
  if (data instanceof Error) return <p>{data?.message}</p>;

  return (
    <ul className='space-y-4'>
      {data.map((pulverizacion) => (
        <PulverizacionItem
          key={pulverizacion.id}
          pulverizacion={pulverizacion}
        />
      ))}
    </ul>
  );
};
