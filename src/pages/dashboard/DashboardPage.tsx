import { DashboardLatestTransactions } from './components/DashboardLatestTransactions';
import { DashboardTotal } from './components/DashboardTotal';

export const DashboardPage = () => {
  return (
    <div className='flex flex-col gap-8'>
      {/* Total Balance, Income, Expense */}
      <DashboardTotal />
      <DashboardLatestTransactions />
    </div>
  );
};
