import { ActionButton } from '@/components/ActionButton';
import { TransactionDialog } from '@/components/TransactionDialog';
import { TransactionTableCore } from './components/TransactionTableCore';

export const TransactionsPage = () => {
  return (
    <div className='flex flex-col gap-5'>
      <section>
        <TransactionDialog
          trigger={<ActionButton text='Create transaction' />}
        />
      </section>
      {/* Table with filters */}
      <section className='space-y-3 '>
        <TransactionTableCore />
      </section>
    </div>
  );
};
