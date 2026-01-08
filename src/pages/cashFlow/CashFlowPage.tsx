import { type AccountItem } from '@/context/accountContext';
import { useTransaction } from '@/context/transactionContext';
import { format, parse, parseISO } from 'date-fns';
import { useMemo, useState } from 'react';
import { CashFlowChart } from './components/CashFlowChart';
import { CashFlowFilters } from './components/CashFlowFilters';
import { CashFlowTotals } from './components/CashFlowTotals';

export type ViewMode = 'year' | 'month' | 'day';

export default function CashFlowPage() {
  const { transactions } = useTransaction();
  const [viewMode, setViewMode] = useState<ViewMode>('year');
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1) // Start of current year
  );
  const [selectedAccount, setSelectedAccount] = useState<
    AccountItem | undefined
  >(undefined);

  // Unique years from ISO dates
  const years = useMemo(() => {
    const uniqueYears = new Set<number>(
      transactions.map((t) => parseISO(t.date).getFullYear())
    );
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [transactions]);

  // Filtered totals: Balance, Income, Expense depending on Account
  const { filteredBalance, filteredIncome, filteredExpense } = useMemo(() => {
    // Filter transactions by date AND optionally by account
    const filtered = transactions.filter((t) => {
      // Date filter
      const date = parseISO(t.date);
      let matchesDate = false;

      if (viewMode === 'year') {
        matchesDate = date.getFullYear() === selectedDate.getFullYear();
      } else if (viewMode === 'month') {
        matchesDate =
          date.getFullYear() === selectedDate.getFullYear() &&
          date.getMonth() === selectedDate.getMonth();
      } else {
        // day view
        matchesDate =
          format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
      }

      // Account filter: if selectedAccount is undefined → include all
      // otherwise, only include transactions from the selectedAccount
      const matchesAccount =
        selectedAccount === undefined || t.account.id === selectedAccount.id;

      return matchesDate && matchesAccount;
    });

    // Calculate totals from filtered transactions
    const balance = filtered.reduce((sum, t) => sum + t.amount, 0);
    const income = filtered
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filtered
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      filteredBalance: balance,
      filteredIncome: income,
      filteredExpense: expense,
    };
  }, [transactions, viewMode, selectedDate, selectedAccount]);

  // Chart data
  const chartData = useMemo(() => {
    // Filter transactions by  selected date and selected account
    const filtered = transactions.filter((t) => {
      const date = parseISO(t.date);

      // Date filter
      let matchesDate = false;
      if (viewMode === 'year') {
        matchesDate = date.getFullYear() === selectedDate.getFullYear();
      } else if (viewMode === 'month') {
        matchesDate =
          date.getFullYear() === selectedDate.getFullYear() &&
          date.getMonth() === selectedDate.getMonth();
      } else {
        // day view
        matchesDate =
          format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
      }

      // Account filter: if no account selected → include all
      const matchesAccount =
        selectedAccount === undefined || t.account.id === selectedAccount.id;

      return matchesDate && matchesAccount;
    });

    if (filtered.length === 0) return [];

    const grouped = new Map<string, { income: number; expense: number }>();

    filtered.forEach((t) => {
      const date = parseISO(t.date);

      // Group key: Month name for year view, full date for day/month view
      const key =
        viewMode === 'year'
          ? format(date, 'MMM') // Jan, Feb, etc.
          : format(date, 'MMM dd'); // Jan 01, Jan 02, etc. 

      const current = grouped.get(key) || { income: 0, expense: 0 };

      if (t.type === 'Income') {
        current.income += t.amount;
      } else if (t.type === 'Expense') {
        current.expense += Math.abs(t.amount); 
      }

      grouped.set(key, current);
    });

    const entries = Array.from(grouped.entries());

    // Sort chronologically
    entries.sort(([keyA], [keyB]) => {
      let dateA: Date;
      let dateB: Date;

      if (viewMode === 'year') {
        // Parse "Jan", "Feb", etc. in context of selected year
        dateA = parse(
          `${keyA} 1, ${selectedDate.getFullYear()}`,
          'MMM d, yyyy',
          new Date()
        );
        dateB = parse(
          `${keyB} 1, ${selectedDate.getFullYear()}`,
          'MMM d, yyyy',
          new Date()
        );
      } else {
        // For day/month view: "Jan 01", "Jan 02", etc.
        dateA = parse(
          `${keyA}, ${selectedDate.getFullYear()}`,
          'MMM dd, yyyy',
          new Date()
        );
        dateB = parse(
          `${keyB}, ${selectedDate.getFullYear()}`,
          'MMM dd, yyyy',
          new Date()
        );
      }

      return dateA.getTime() - dateB.getTime();
    });

    // Map to chart format
    return entries.map(([name, data]) => ({
      name,
      income: data.income,
      expense: data.expense,
    }));
  }, [transactions, viewMode, selectedDate, selectedAccount]); // ← Don't forget selectedAccount!

  return (
    <div className='space-y-3'>
      {/**Filter */}
      <section>
        <CashFlowFilters
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          years={years}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
        />
      </section>

      {/**Chart */}
      <section>
        <CashFlowChart chartData={chartData} />
      </section>

      {/**Totals */}
      <section>
        <CashFlowTotals
          balance={filteredBalance}
          income={filteredIncome}
          expense={filteredExpense}
        />
      </section>
    </div>
  );
}
