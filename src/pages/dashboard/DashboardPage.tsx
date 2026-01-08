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
        <div className='flex gap-3 h-60 flex-wrap'>
          <div className='flex-1 h-full'>
            <DashboardBalance />
          </div>
          <div className='flex-1 h-full'>
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
