import { Metadata } from 'next';
import Screen from '@/components/screen';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Facturación',
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userdata = JSON.parse(
    (await cookies()).get('userdata')?.value as string,
  );

  return <Screen userdata={userdata}>{children}</Screen>;
}
