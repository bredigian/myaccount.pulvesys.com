import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos & Condiciones',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
