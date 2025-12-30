import Dashboard from '@/pages/Dashboard';
import { Transactions } from '@/pages/transactions/Transactions';
import { LayoutDashboard, Wallet, type LucideIcon } from 'lucide-react';
import type React from 'react';

type NavItem = {
  title: string;
  isIndex?: boolean;
  href: string;
  element: React.ReactNode;
  icon: LucideIcon;
};
export const NavMenu: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    isIndex: true,
    element: <Dashboard />,
    icon: LayoutDashboard,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    element: <Transactions />,
    icon: Wallet ,
  },
];
