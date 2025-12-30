/* eslint-disable react-refresh/only-export-components */
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { createContext, useContext, useMemo } from 'react';
import type { CategoryItem } from './categoryContext';

export const TRANSACTION_TYPES = ['Income', 'Expense'];
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export interface TransactionBase {
  description: string;
  amount: number;
  category: CategoryItem;
  type: TransactionType;
  date: string;
}

export interface TransactionItem extends TransactionBase {
  id: string;
}

// Default initial values
const DEFAULT_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'seed-1',
    description: 'Salary',
    amount: 5000,
    type: 'Income',
    category: { id: '1', name: 'Salary' },
    date: '12-15-2025', // Mid-December
  },
  {
    id: 'seed-2',
    description: 'Grocery',
    amount: -250,
    type: 'Expense',
    category: { id: '2', name: 'Grocery' },
    date: '12-30-2025', // Today!
  },
  {
    id: 'seed-3',
    description: 'Bonus',
    amount: 1000,
    type: 'Income',
    category: { id: '1', name: 'Salary' },
    date: '12-01-2025',
  },
];

interface TransactionContextType {
  transactions: TransactionItem[];
  balance: number;
  income: number;
  expense: number;
  addTransaction: (transaction: Omit<TransactionItem, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<TransactionItem>) => void;
  deleteTransaction: (id: string) => void;
}

export const TransactionContext = createContext<
  TransactionContextType | undefined
>(undefined);

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useLocalStorage<TransactionItem[]>(
    'TRANSACTIONS',
    DEFAULT_TRANSACTIONS
  );

  // Parse 'MM-DD-YYYY' date string into real Date object
  const parseDate = (dateStr: string): Date => {
    const [month, day, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Sort transactions: newest first
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      return parseDate(b.date).getTime() - parseDate(a.date).getTime();
    });
  }, [transactions]);

  // Calculate balance from transactions
  const balance = sortedTransactions.reduce((acc, t) => {
    return acc + t.amount;
  }, 0);

  // Calculate income from transactions
  const income = sortedTransactions
    .filter((income) => income.type === 'Income')
    .reduce((sum, income) => sum + income.amount, 0);

  // Calculate expense from transactions
  const expense = Math.abs(
    sortedTransactions
      .filter((expense) => expense.type === 'Expense')
      .reduce((sum, expense) => sum + expense.amount, 0)
  );

  const addTransaction = (newTransaction: Omit<TransactionItem, 'id'>) => {
    const transaction: TransactionItem = {
      id: crypto.randomUUID(), // generates unique ID
      ...newTransaction,
    };

    setTransactions((prev) => [...prev, transaction]);
  };

  const updateTransaction = (id: string, updates: Partial<TransactionItem>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions: sortedTransactions,
        balance,
        income,
        expense,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction(): TransactionContextType {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within TransactionProvider');
  }
  return context;
}
