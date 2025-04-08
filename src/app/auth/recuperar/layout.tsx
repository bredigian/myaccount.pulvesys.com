import { Metadata } from 'next';

const APP_DEFAULT_TITLE = 'Restablecer contraseña';
const APP_TITLE_TEMPLATE = '%s | PulveSys';

export const metadata: Metadata = {
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
};

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
