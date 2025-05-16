import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cultivos & Tratamientos (sin conexión)',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
