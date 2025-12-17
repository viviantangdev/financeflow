import { createContext, useEffect, useState } from 'react';

type CategoryType = 'Entertainment' | 'Food';
type TransactionType = 'Income' | 'Expense';

type TransactionItem = {
  id: string;
  amount: number;
  category: CategoryType;
  type: TransactionType;
  date: string;
};

interface FinanceContextType {
  transactions: TransactionItem[];
  balance: number;
  addTransaction: (transaction: TransactionItem) => void;
  removeTransaction: (id: string) => void;
}
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const FINANCE_STORAGE_KEY = 'finance';

function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  // Calculate balance from transactions
  const balance = transactions.reduce((acc, t) => {
    return t.type === 'Income' ? acc + t.amount : acc - t.amount;
  }, 0);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // First time: seed with default data
    const defaultTransactions: TransactionItem[] = [
      {
        id: 'seed-1', // simple fixed IDs for seed data
        amount: 2500,
        type: 'Income',
        category: 'Food',
        date: new Date('2025-12-01').toISOString(),
      },
      {
        id: 'seed-2',
        amount: 80,
        type: 'Expense',
        category: 'Food',
        date: new Date('2025-12-12').toISOString(),
      },
      {
        id: 'seed-3',
        amount: 15.5,
        type: 'Expense',
        category: 'Food',
        date: new Date('2025-12-08').toISOString(),
      },
      {
        id: 'seed-4',
        amount: 60,
        type: 'Expense',
        category: 'Entertainment',
        date: new Date('2025-12-05').toISOString(),
      },
      {
        id: 'seed-5',
        amount: 35,
        type: 'Expense',
        category: 'Food',
        date: new Date('2025-11-25').toISOString(),
      },
      {
        id: 'seed-6',
        amount: 120,
        type: 'Expense',
        category: 'Entertainment',
        date: new Date('2025-12-10').toISOString(),
      },
    ];

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTransactions(defaultTransactions);
    localStorage.setItem(
      FINANCE_STORAGE_KEY,
      JSON.stringify(defaultTransactions)
    );
    try {
      const stored = localStorage.getItem(FINANCE_STORAGE_KEY);

      if (stored) {
        const parsed: TransactionItem[] = JSON.parse(stored);
        setTransactions(parsed);
      }
    } catch (error) {
      console.error('Failed to load or seed transactions:', error);
      // Fallback: start empty if something went wrong
      setTransactions([]);
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions to localStorage:', error);
    }
  }, [transactions]);

  const addTransaction = (newTransaction: TransactionItem) => {
    const transactionWithMeta: TransactionItem = {
      ...newTransaction,
      id: crypto.randomUUID(), // generates unique ID
      date: new Date().toISOString(),
    };

    setTransactions((prev) => [...prev, transactionWithMeta]);
  };

  const removeTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{ transactions, balance, addTransaction, removeTransaction }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export { FinanceContext, FinanceProvider };
