import { RedirectType, redirect } from 'next/navigation';

import { cookies } from 'next/headers';
import { getCampos } from '@/services/campos.service';
import { CamposGridContainer } from './masonry-container';

interface Props {
  query: string;
}

export default async function CamposContainer({ query }: Props) {
  const access_token = (await cookies()).get('access_token');
  if (!access_token) redirect('/', RedirectType.replace);

  const data = await getCampos(access_token.value);
  if (data instanceof Error) return <p>{data?.message}</p>;

  const filteredData = !query
    ? data
    : data.filter((item) =>
        item.nombre.toLowerCase().includes(query.toLowerCase()),
      );

  return <CamposGridContainer data={filteredData} />;
}
