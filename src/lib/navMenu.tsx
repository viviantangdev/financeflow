import CashFlowPage from '@/pages/cashFlow/CashFlowPage';
import { CategoriesPage } from '@/pages/categories/CategoriesPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { TransactionsPage } from '@/pages/transactions/TransactionsPage';
import {
  LayoutDashboard,
  Tag,
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
    element: <DashboardPage />,
    icon: LayoutDashboard,
  },
  {
    title: 'Cash Flow',
    href: '/cashflow',
    element: <CashFlowPage />,
    icon: TrendingUpDown,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    element: <TransactionsPage />,
    icon: Wallet,
  },
  {
    title: 'Categories',
    href: '/categories',
    element: <CategoriesPage />,
    icon: Tag,
  },
];
