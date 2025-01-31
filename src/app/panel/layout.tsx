import Screen from '@/components/screen';
import { cookies } from 'next/headers';

export default async function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userdata = JSON.parse(
    (await cookies()).get('userdata')?.value as string,
  );

  return <Screen userdata={userdata}>{children}</Screen>;
}
