import { useTransaction } from '@/context/transactionContext';
import { format, parseISO } from 'date-fns';
import { useMemo, useState } from 'react';
import { CashFlowChart } from './CashFlowChart';
import { CashFlowFilters } from './CashFlowFilters';

type ViewMode = 'year' | 'month' | 'day';

export const CashFlowChartCore = () => {
  const { transactions } = useTransaction();
  const [viewMode, setViewMode] = useState<ViewMode>('year');
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1) // Start of current year
  );

  // Unique years from ISO dates
  const years = useMemo(() => {
    const uniqueYears = new Set<number>(
      transactions.map((t) => parseISO(t.date).getFullYear())
    );
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [transactions]);

  // Filtered totals: Balance, Income, Expense
  const { filteredBalance, filteredIncome, filteredExpense } = useMemo(() => {
    const filtered = transactions.filter((t) => {
      const date = parseISO(t.date);
      if (viewMode === 'year')
        return date.getFullYear() === selectedDate.getFullYear();
      if (viewMode === 'month')
        return (
          date.getFullYear() === selectedDate.getFullYear() &&
          date.getMonth() === selectedDate.getMonth()
        );
      return format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    });

    const balance = filtered.reduce((sum, t) => sum + t.amount, 0);

    const income = filtered
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = Math.abs(
      filtered
        .filter((t) => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0)
    );

    return {
      filteredBalance: balance,
      filteredIncome: income,
      filteredExpense: expense,
    };
  }, [transactions, viewMode, selectedDate]);

  // Chart data
  const chartData = useMemo(() => {
    const filtered = transactions.filter((t) => {
      const date = parseISO(t.date);
      if (viewMode === 'year')
        return date.getFullYear() === selectedDate.getFullYear();
      if (viewMode === 'month')
        return (
          date.getFullYear() === selectedDate.getFullYear() &&
          date.getMonth() === selectedDate.getMonth()
        );
      return format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    });

    if (filtered.length === 0) return [];

    const grouped = new Map<string, { income: number; expense: number }>();

    filtered.forEach((t) => {
      const date = parseISO(t.date);
      const key =
        viewMode === 'year'
          ? format(date, 'MMM')
          : format(date, 'MMM dd, yyyy');

      const current = grouped.get(key) || { income: 0, expense: 0 };
      if (t.type === 'Income') current.income += t.amount;
      else current.expense += Math.abs(t.amount);
      grouped.set(key, current);
    });

    const entries = Array.from(grouped.entries());

    // Sort chronologically using real dates
    entries.sort(([keyA], [keyB]) => {
      let dateA: Date;
      let dateB: Date;

      if (viewMode === 'year') {
        dateA = new Date(`${keyA} 1, ${selectedDate.getFullYear()}`);
        dateB = new Date(`${keyB} 1, ${selectedDate.getFullYear()}`);
      } else {
        const [monthA, dayA] = keyA.split(' ');
        const [monthB, dayB] = keyB.split(' ');
        dateA = new Date(`${monthA} ${dayA}, ${selectedDate.getFullYear()}`);
        dateB = new Date(`${monthB} ${dayB}, ${selectedDate.getFullYear()}`);
      }

      return dateA.getTime() - dateB.getTime();
    });

    return entries.map(([name, data]) => ({
      name,
      income: data.income,
      expense: data.expense,
    }));
  }, [transactions, viewMode, selectedDate]);

  return (
    <div className='space-y-3'>
      <CashFlowFilters
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        years={years}
      />

      <CashFlowChart
        chartData={chartData}
        balance={filteredBalance}
        income={filteredIncome}
        expense={filteredExpense}
        viewMode={viewMode}
        selectedDate={selectedDate}
      />
    </div>
  );
};
