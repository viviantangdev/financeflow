import { AccountPage } from '@/pages/account/AccountPage';
import CashFlowPage from '@/pages/cashFlow/CashFlowPage';
import { CategoriesPage } from '@/pages/categories/CategoriesPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { TransactionsPage } from '@/pages/transactions/TransactionsPage';
import {
  AlignEndHorizontal,
  CreditCard,
  LayoutDashboard,
  Repeat,
  Tag,
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
    icon: AlignEndHorizontal,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    element: <TransactionsPage />,
    icon: Repeat,
  },
  {
    title: 'Categories',
    href: '/categories',
    element: <CategoriesPage />,
    icon: Tag,
  },
  {
    title: 'Account',
    href: '/account',
    element: <AccountPage />,
    icon: CreditCard,
  },
];
