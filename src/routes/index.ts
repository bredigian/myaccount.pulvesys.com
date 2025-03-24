import {
  CreditCard,
  Droplets,
  LayoutDashboard,
  Leaf,
  LucideProps,
  MapIcon,
  Package,
  Users,
} from 'lucide-react';
import { ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react';

type Route = {
  title: string;
  url: `/${string}`;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  isActive?: boolean;
};

export const ROUTES: Route[] = [
  {
    title: 'Pulverizaciones',
    url: '/panel',
    icon: Droplets,
    isActive: true,
  },
  {
    title: 'Productos',
    url: '/panel/productos',
    icon: Package,
  },
  {
    title: 'Cultivos & Tratamientos',
    url: '/panel/cultivos&tratamientos',
    icon: Leaf,
  },
  {
    title: 'Ubicaciones',
    url: '/panel/campos',
    icon: MapIcon,
  },
];

export const ENTERPRISE_ROUTES: Route[] = [
  {
    title: 'Panel',
    url: '/empresa',
    icon: LayoutDashboard,
  },
  {
    title: 'Usuarios',
    url: '/empresa/usuarios',
    icon: Users,
  },
  {
    title: 'Pagos & Facturación',
    url: '/empresa/facturacion',
    icon: CreditCard,
  },
];
