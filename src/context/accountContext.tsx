import { useLocalStorage } from '@/hooks/useLocalStorage';
import React, { createContext, useContext } from 'react';

export type AccountBase = {
  name: string;
  balance: number;
};
export interface AccountItem extends AccountBase {
  id: string;
}

const DEFAULT_ACCOUNTS: AccountItem[] = [
  { id: '1', name: 'Debit', balance: -100000 },
  { id: '2', name: 'Saving', balance: 100 },
  { id: '3', name: 'Cash', balance: 100 },
];

type AccountContextType = {
  accounts: AccountItem[];
  addAccount: (account: AccountBase) => void;
  updateAccount: (id: string, updates: Partial<AccountItem>) => void;
  deleteAccount: (id: string) => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AccountContext = createContext<AccountContextType | undefined>(
  undefined
);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useLocalStorage<AccountItem[]>(
    'ACCOUNTS',
    DEFAULT_ACCOUNTS
  );

  const addAccount = (newAccount: AccountBase) => {
    const account: AccountItem = {
      id: crypto.randomUUID(),
      ...newAccount,
    };

    setAccounts((prev) => [...prev, account]);
  };

  const updateAccount = (id: string, updates: Partial<AccountItem>) => {
    setAccounts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AccountContext.Provider
      value={{ accounts, addAccount, updateAccount, deleteAccount }}
    >
      {children}
    </AccountContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAccount():AccountContextType {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within AccountProvider');
  }
  return context;
}
