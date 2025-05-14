import { Metadata } from 'next';
import OfflineScreen from '@/components/offline-screen';

export const metadata: Metadata = {
  title: 'Inicio (sin conexión)',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <OfflineScreen>{children}</OfflineScreen>;
}
