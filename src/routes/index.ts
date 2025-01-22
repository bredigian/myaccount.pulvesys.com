import { Droplet, Leaf, ListCheck, MapIcon, Package } from 'lucide-react';

export const ROUTES = [
  {
    title: 'Pulverizaciones',
    url: '/panel',
    icon: Droplet,
    isActive: true,
  },
  {
    title: 'Productos',
    url: '/panel/productos',
    icon: Package,
  },
  {
    title: 'Tratamientos',
    url: '/panel/tratamientos',
    icon: ListCheck,
  },
  {
    title: 'Cultivos',
    url: '/panel/cultivos',
    icon: Leaf,
  },
  {
    title: 'Campos',
    url: '/panel/campos',
    icon: MapIcon,
  },
];
