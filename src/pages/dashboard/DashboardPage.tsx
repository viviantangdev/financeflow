import { DashboardLatestTransactions } from './components/DashboardLatestTransactions';
import { DashboardTotal } from './components/DashboardTotal';

export const DashboardPage = () => {
  return (
    <div className='flex flex-col gap-12'>
      {/* Total Balance, Income, Expense */}
      <DashboardTotal />
      <DashboardLatestTransactions />
    </div>
  );
};
