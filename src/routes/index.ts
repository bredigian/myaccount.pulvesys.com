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
    url: '/dashboard',
    icon: Droplets,
    isActive: true,
  },
  {
    title: 'Productos',
    url: '/dashboard/products',
    icon: Package,
  },
  {
    title: 'Cultivos & Tratamientos',
    url: '/dashboard/crops&treatments',
    icon: Leaf,
  },
  {
    title: 'Ubicaciones',
    url: '/dashboard/locations',
    icon: MapIcon,
  },
];

export const ENTERPRISE_ROUTES: Route[] = [
  {
    title: 'Inicio',
    url: '/enterprise',
    icon: LayoutDashboard,
  },
  {
    title: 'Usuarios',
    url: '/enterprise/users',
    icon: Users,
  },
];

export const SUBSCRIPTION_ROUTES: Route[] = [
  {
    title: 'Pagos & Facturación',
    url: '/billing',
    icon: CreditCard,
  },
];

export const EXTRAS_ROUTES: Route[] = [
  {
    title: 'Historial',
    url: '/logs',
    icon: History,
  },
];
