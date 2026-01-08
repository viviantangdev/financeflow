import { DashboardAccounts } from './components/DashboardAccounts';
import { DashboardBalance } from './components/DashboardBalance';
import { DashboardCashflow } from './components/DashboardCashflow';
import { DashboardLatestTransactions } from './components/DashboardLatestTransactions';

export const DashboardPage = () => {
  return (
    <div className='space-y-10'>
      {/* <section>
        <DashboardTotal />
      </section> */}
      <section>
        <div className='flex gap-3'>
          <div className='flex-1'>
            <DashboardBalance />
          </div>
          <div className='flex-1'>
            <DashboardCashflow />
          </div>
        </div>
      </section>
      <section>
        <DashboardAccounts />
      </section>
      <section>
        <DashboardLatestTransactions />
      </section>
    </div>
  );
};
