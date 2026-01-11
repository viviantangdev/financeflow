import { DashboardAccounts } from './components/DashboardAccounts';
import { DashboardBalance } from './components/DashboardBalance';
import { DashboardCashflow } from './components/DashboardCashflow';
import { DashboardLatestTransactions } from './components/DashboardLatestTransactions';

export const DashboardPage = () => {
  return (
    <div className='space-y-10'>
      <section>
        <DashboardBalance />
      </section>
      <section>
        <DashboardAccounts />
      </section>
      <section>
        <DashboardCashflow />
      </section>
      <section>
        <DashboardLatestTransactions />
      </section>
    </div>
  );
};
