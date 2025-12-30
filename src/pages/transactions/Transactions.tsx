import { ActionButton } from '@/components/ActionButton';
import { TransactionDialog } from '@/components/TransactionDialog';
import { TransactionTable } from './components/TransactionTable';

export const Transactions = () => {
  return (
    <div className='flex flex-col gap-5'>
      <section>
        <TransactionDialog
          trigger={<ActionButton text='Create transaction' />}
        />
      </section>
      <section className='space-y-3 '>
        <TransactionTable />
      </section>
    </div>
  );
};
