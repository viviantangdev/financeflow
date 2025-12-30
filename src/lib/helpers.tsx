import type { TransactionType } from '@/context/transactionContext';
import { format } from 'date-fns';

export function getFormatDate(date: Date) {
  return format(new Date(date), 'MM-dd-yyyy');
}

export const getSignedAmount = (
  amount: number,
  type: TransactionType
): number => {
  return type === 'Expense' ? -amount : amount;
};

export const getFormatNumber = (value: number): string => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1_000_000_000) {
    return (
      sign + (absValue / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
    );
  }
  if (absValue >= 1_000_000) {
    return sign + (absValue / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (absValue >= 1_000) {
    return sign + (absValue / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return sign + absValue.toString();
};
