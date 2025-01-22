import Screen from '@/components/screen';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Screen>{children}</Screen>;
}
