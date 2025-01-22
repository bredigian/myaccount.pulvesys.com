import { Droplet, Leaf, ListCheck, MapIcon, Package } from 'lucide-react';

export const ROUTES = [
  {
    title: 'Pulverizaciones',
    url: '/dashboard',
    icon: Droplet,
    isActive: true,
  },
  {
    title: 'Productos',
    url: '/dashboard/productos',
    icon: Package,
  },
  {
    title: 'Tratamientos',
    url: '/dashboard/tratamientos',
    icon: ListCheck,
  },
  {
    title: 'Cultivos',
    url: '/dashboard/cultivos',
    icon: Leaf,
  },
  {
    title: 'Campos',
    url: '/dashboard/campos',
    icon: MapIcon,
  },
];
