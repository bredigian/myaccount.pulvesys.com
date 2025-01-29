import CampoItem from './campo-item';
import { getCampos } from '@/services/campos.service';

interface Props {
  query: string;
}

export default async function CamposContainer({ query }: Props) {
  const data = await getCampos();
  if (data instanceof Error) return <p>{data?.message}</p>;

  const filteredData = !query
    ? data
    : data.filter((item) =>
        item.nombre.toLowerCase().includes(query.toLowerCase()),
      );

  return (
    <ul className='space-y-4'>
      {filteredData.length > 0 ? (
        filteredData.map((campo) => <CampoItem key={campo.id} data={campo} />)
      ) : (
        <li className='pt-4 text-center opacity-75'>
          No se encontraron ubicaciones
        </li>
      )}
    </ul>
  );
}
