import { Metadata } from 'next';
import Screen from '@/components/screen';
import { cookies } from 'next/headers';

const APP_DEFAULT_TITLE = 'Pulverizaciones';
const APP_TITLE_TEMPLATE = '%s | PulveSys';

export const metadata: Metadata = {
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
};

export default async function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userdata = JSON.parse(
    ((await cookies()).get('userdata')?.value as string) || '{}',
  );

  return <Screen userdata={userdata}>{children}</Screen>;
}
