import {
  Apple,
  Bike,
  Car,
  Clapperboard,
  Coffee,
  House,
  Shirt,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  X, //Fallback icon
  House,
  Apple,
  Bike,
  Shirt,
  Clapperboard,
  Wallet,
  Coffee,
  Car,
};

export const iconList = Object.keys(iconMap) as (keyof typeof iconMap)[];