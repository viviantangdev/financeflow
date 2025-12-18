/* eslint-disable react-refresh/only-export-components */
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { createContext, useContext } from 'react';
import type { CategoryItem } from './categoryContext';

export const TRANSACTION_TYPES = ['Income', 'Expense'];
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

type TransactionItem = {
  id: string;
  description: string;
  amount: number;
  category: CategoryItem;
  type: TransactionType;
  date: string;
};

// Default initial values
const DEFAULT_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'seed-1', // simple fixed IDs for seed data
    description: 'Grocery',
    amount: 250,
    type: 'Income',
    category: { id: '1', name: 'Salary' },
    date: '2025-12-01',
  },
];

interface TransactionContextType {
  transactions: TransactionItem[];
  balance: number;
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

  // Calculate balance from transactions
  const balance = transactions.reduce((acc, t) => {
    return acc + t.amount;
  }, 0);

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
        transactions,
        balance,
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
