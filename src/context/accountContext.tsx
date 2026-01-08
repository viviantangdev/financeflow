import { useLocalStorage } from '@/hooks/useLocalStorage';
import { format } from 'date-fns';
import React, { createContext, useContext } from 'react';

export type AccountBase = {
  name: string;
  balance: number;
};
export interface AccountItem extends AccountBase {
  id: string;
}
export type TransferBase = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string; // ISO format: 'YYYY-MM-DD'
};
export interface TransferItem extends TransferBase {
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
  transfers: TransferItem[];
  transferMoney: (transfer: TransferBase) => void;
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
  const [transfers, setTransfers] = useLocalStorage<TransferItem[]>(
    'TRANSFERS',
    []
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

  const transferMoney = (newTransfer: TransferBase) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === newTransfer.fromAccountId)
          return { ...acc, balance: acc.balance - newTransfer.amount };
        if (acc.id === newTransfer.toAccountId)
          return { ...acc, balance: acc.balance + newTransfer.amount };
        return acc;
      })
    );

    const dateStr =
      typeof newTransfer.date === 'string'
        ? newTransfer.date
        : format(newTransfer.date, 'yyyy-MM-dd');

    setTransfers((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...newTransfer,
        date: dateStr,
      },
    ]);
  };

  return (
    <AccountContext.Provider
      value={{
        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
        transfers,
        transferMoney,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAccount(): AccountContextType {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within AccountProvider');
  }
  return context;
}
