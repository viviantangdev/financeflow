import { AccountPage } from '@/pages/account/AccountPage';
import CashFlowPage from '@/pages/cashFlow/CashFlowPage';
import { CategoriesPage } from '@/pages/categories/CategoriesPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { TransactionsPage } from '@/pages/transactions/TransactionsPage';
import {
  Activity,
  CreditCard,
  LayoutDashboard,
  Receipt,
  Tags,
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
    icon: Activity,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    element: <TransactionsPage />,
    icon: Receipt,
  },
  {
    title: 'Categories',
    href: '/categories',
    element: <CategoriesPage />,
    icon: Tags,
  },
  {
    title: 'Account',
    href: '/account',
    element: <AccountPage />,
    icon: CreditCard,
  },
];
