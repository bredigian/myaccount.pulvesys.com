import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Usuarios (Empresa)',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
