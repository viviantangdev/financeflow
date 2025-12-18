/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';

export const CATEGORIES = ['Food', 'Entertainment', 'Movie'];
export type CategoryType = (typeof CATEGORIES)[number];

export const EXPENSE_CATEGORIES = ['Food', 'Entertainment', 'Movie'];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Bonus'];
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];

export const TRANSACTION_TYPES = ['Income', 'Expense'];
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

type TransactionItem = {
  id: string;
  description: string;
  amount: number;
  category: CategoryType;
  type: TransactionType;
  date: string;
};

interface FinanceContextType {
  transactions: TransactionItem[];
  balance: number;
  addTransaction: (transaction: Omit<TransactionItem, 'id'>) => void;
  removeTransaction: (id: string) => void;
}

// Default initial values
const defaultTransactions: TransactionItem[] = [
  {
    id: 'seed-1', // simple fixed IDs for seed data
    description: 'Grocery',
    amount: 250,
    type: 'Income',
    category: 'Food',
    date: '2025-12-01',
  },
  {
    id: 'seed-2',
    description: 'Grocery',
    amount: 80,
    type: 'Expense',
    category: 'Food',
    date: '2025-12-01',
  },
  {
    id: 'seed-3',
    description: 'Grocery',
    amount: 15.5,
    type: 'Expense',
    category: 'Food',
    date: '2025-12-01',
  },
  {
    id: 'seed-4',
    description: 'Grocery',
    amount: 60,
    type: 'Expense',
    category: 'Entertainment',
    date: '2025-12-01',
  },
  {
    id: 'seed-5',
    description: 'Grocery',
    amount: 35,
    type: 'Expense',
    category: 'Food',
    date: '2025-12-01',
  },
];

export const financeContext = createContext<FinanceContextType | undefined>(
  undefined
);

const FINANCE_STORAGE_KEY = 'finance';

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] =
    useState<TransactionItem[]>(defaultTransactions);

  // Calculate balance from transactions
  const balance = transactions.reduce((acc, t) => {
    return acc + t.amount;
  }, 0);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(FINANCE_STORAGE_KEY);
      if (stored) {
        const parsed: TransactionItem[] = JSON.parse(stored);
        setTransactions(parsed);
      }
    } catch (error) {
      console.error('Failed to load or seed transactions:', error);
    }
  }, []);

  // Sync to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions to localStorage:', error);
    }
  }, [transactions]);

  const addTransaction = (newTransaction: Omit<TransactionItem, 'id'>) => {
    const transaction: TransactionItem = {
      id: crypto.randomUUID(), // generates unique ID
      ...newTransaction,
    };

    setTransactions((prev) => [...prev, transaction]);
  };

  const removeTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <financeContext.Provider
      value={{ transactions, balance, addTransaction, removeTransaction }}
    >
      {children}
    </financeContext.Provider>
  );
}

export function useFinance(): FinanceContextType {
  const context = useContext(financeContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
}
