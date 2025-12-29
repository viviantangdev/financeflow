import Dashboard from '@/pages/Dashboard';
import { Transaction } from '@/pages/Transaction';
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
    title: 'Transaction',
    href: '/transaction',
    element: <Transaction />,
    icon: Wallet ,
  },
];
