import { Droplets, Leaf, MapIcon, Package } from 'lucide-react';

export const ROUTES = [
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
