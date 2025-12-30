import CashFlow from '@/pages/cashFlow/CashFlow';
import Dashboard from '@/pages/dashboard/Dashboard';
import { Transactions } from '@/pages/transactions/Transactions';
import {
  LayoutDashboard,
  TrendingUpDown,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
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
    title: 'Cash Flow',
    href: '/cashflow',
    element: <CashFlow />,
    icon: TrendingUpDown,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    element: <Transactions />,
    icon: Wallet,
  },
];
