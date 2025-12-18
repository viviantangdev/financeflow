import AddTransactionButton from '@/components/AddTransactionButton';
import TransactionTable from '@/components/TransactionTable';
import { useTransaction } from '@/context/transactionContext';

const Dashboard = () => {
  const {transactions} = useTransaction();
  return (
    <>
      <AddTransactionButton />
      <TransactionTable />
<button
  onClick={() => {
    // Force re-render + wait for effects
    const current = localStorage.getItem('transactions');
    console.log('Current state:', transactions);
    console.log('localStorage raw:', current);
  }}
>
  DEBUG LOG
</button>
    </>
  );
};

export default Dashboard;
