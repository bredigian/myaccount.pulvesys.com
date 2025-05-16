import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Productos (sin conexión)',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
