import { ActionButton } from '@/components/ActionButton';
import { TransactionDialog } from '@/components/TransactionDialog';
import TransactionTable from '@/components/tables/transaction/TransactionTable';
import { useTransaction } from '@/context/transactionContext';

export const Transactions = () => {
  const { transactions } = useTransaction();
  return (
    <div className='flex flex-col gap-5'>
      <section>
        <TransactionDialog
          trigger={<ActionButton text='Create transaction' />}
        />
      </section>
      <section className='space-y-3'>
        <h3>All transactions ({`${transactions.length}`})</h3>
     
          <TransactionTable />
     
      </section>
    </div>
  );
};
