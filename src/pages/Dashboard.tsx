import { ActionButton } from '@/components/ActionButton';
import { ThemeButton } from '@/components/ThemeButton';
import { TransactionDialog } from '@/components/TransactionDialog';
import TransactionTable from '@/components/TransactionTable';

const Dashboard = () => {
  return (
    <>
      <TransactionDialog trigger={<ActionButton text='Add transaction' />} />
      <TransactionTable />
      <ThemeButton />
    </>
  );
};

export default Dashboard;
