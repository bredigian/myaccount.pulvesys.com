import {
  CreditCard,
  Droplets,
  History,
  LayoutDashboard,
  Leaf,
  LucideProps,
  MapIcon,
  Package,
  Users,
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

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
];

export const SUBSCRIPTION_ROUTES: Route[] = [
  {
    title: 'Pagos & Facturación',
    url: '/facturacion',
    icon: CreditCard,
  },
];

export const EXTRAS_ROUTES: Route[] = [
  {
    title: 'Historial',
    url: '/historial',
    icon: History,
  },
];
