/* eslint-disable react-refresh/only-export-components */
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { format } from 'date-fns';
import { createContext, useContext, useMemo } from 'react';
import type { CategoryItem } from './categoryContext';

export const TRANSACTION_TYPES = ['Income', 'Expense'];
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export interface TransactionBase {
  description: string;
  amount: number;
  category: CategoryItem;
  type: TransactionType;
  date: string; // ISO format: 'YYYY-MM-DD'
}

export interface TransactionItem extends TransactionBase {
  id: string;
}

// Default initial values
const DEFAULT_TRANSACTIONS: TransactionItem[] = [
  {
    id: '1',
    description: 'Rent',
    amount: -5000,
    type: 'Expense',
    category: { id: '1', name: 'Housing', iconName: 'House' },
    date: '2026-01-15',
  },
  {
    id: '2',
    description: 'Groceries',
    amount: -200,
    type: 'Expense',
    category: { id: '2', name: 'Food', iconName: 'Apple' },
    date: '2026-01-15',
  },
  {
    id: '3',
    description: 'Gas',
    amount: -500,
    type: 'Expense',
    category: { id: '3', name: 'Transportation', iconName: 'Bike' },
    date: '2026-02-15',
  },
  {
    id: '4',
    description: 'Clothing',
    amount: -100,
    type: 'Expense',
    category: { id: '4', name: 'Lifestyle', iconName: 'Shirt' },
    date: '2026-01-15',
  },
  {
    id: '5',
    description: 'Movies',
    amount: -5000,
    type: 'Expense',
    category: { id: '5', name: 'Entertainment', iconName: 'Clapperboard' },
    date: '2026-01-15',
  },
  {
    id: '6',
    description: 'Bonus',
    amount: 5000,
    type: 'Income',
    category: { id: '6', name: 'Wages', iconName: 'Wallet' },
    date: '2026-01-15',
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

  // Sort newest → oldest using ISO strings (lexicographically correct!)
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => b.date.localeCompare(a.date));
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
  const expense = sortedTransactions
    .filter((expense) => expense.type === 'Expense')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const addTransaction = (newTransaction: Omit<TransactionItem, 'id'>) => {
    const dateStr =
      typeof newTransaction.date === 'string'
        ? newTransaction.date
        : format(newTransaction.date, 'yyyy-MM-dd');

    const transaction: TransactionItem = {
      id: crypto.randomUUID(),
      ...newTransaction,
      date: dateStr,
    };

    setTransactions((prev) => [...prev, transaction]);
  };

  const updateTransaction = (id: string, updates: Partial<TransactionItem>) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updates,
              // Normalize date if updated
              ...(updates.date && {
                date:
                  typeof updates.date === 'string'
                    ? updates.date
                    : format(updates.date, 'yyyy-MM-dd'),
              }),
            }
          : t
      )
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
