import type { TransactionType } from "@/context/financeContext";
import { format } from "date-fns";

export function formatDate(dateString: string) {
  return format(new Date(dateString), 'yyyy-MM-dd');
}
export function formatDateToYYYYMMDD(dateInput: Date | string | number): string {
  const date = new Date(dateInput);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date provided to formatDateToYYYYMMDD');
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const getSignedAmount = (amount: number, type: TransactionType): number => {
  return type === 'Expense' ? -amount : amount;
};