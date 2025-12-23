import { ActionButton } from '@/components/ActionButton';
import { TransactionDialog } from '@/components/TransactionDialog';
import TransactionTable from '@/components/TransactionTable';

const Dashboard = () => {
  return (
    <>
      <TransactionDialog trigger={<ActionButton text='Add transaction' />} />
      <TransactionTable />
    </>
  );
};

export default Dashboard;
