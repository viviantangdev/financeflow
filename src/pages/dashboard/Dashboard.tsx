import { DashboardTotal } from './components/DashboardTotal';

const Dashboard = () => {
  return (
    <div className='flex flex-col gap-12'>
      {/* Total Balance, Income, Expense */}
      <DashboardTotal />
    </div>
  );
};

export default Dashboard;
