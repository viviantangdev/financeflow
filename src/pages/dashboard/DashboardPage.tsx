import { DashboardRecentTransactions } from './components/DashboardRecentTransactions';
import { DashboardTotal } from './components/DashboardTotal';

export const DashboardPage = () => {
  return (
    <div className='flex flex-col gap-12'>
      {/* Total Balance, Income, Expense */}
      <DashboardTotal />
      <DashboardRecentTransactions />
    </div>
  );
};
