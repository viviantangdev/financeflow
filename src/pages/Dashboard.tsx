import { ActionButton } from '@/components/ActionButton';
import { CardLayout } from '@/components/CardLayout';
import { ThemeButton } from '@/components/ThemeButton';
import { TransactionDialog } from '@/components/TransactionDialog';
import TransactionTable from '@/components/TransactionTable';
import { Separator } from '@/components/ui/separator';
import { useTransaction } from '@/context/transactionContext';
import { getFormatNumber } from '@/lib/helpers';

const Dashboard = () => {
  const { transactions } = useTransaction();
  const totalBalance = transactions.reduce(
    (sum, income) => sum + income.amount,
    0
  );
  const totalIncome = transactions
    .filter((income) => income.type === 'Income')
    .reduce((sum, income) => sum + income.amount, 0);
  const totalExpense = Math.abs(
    transactions
      .filter((expense) => expense.type === 'Expense')
      .reduce((sum, expense) => sum + expense.amount, 0)
  );

  return (
    <main className='flex flex-col gap-5'>
      <TransactionDialog trigger={<ActionButton text='Add transaction' />} />
      <section className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <CardLayout>
          <div className='flex flex-col items-center'>
              <span className='text-sm text-muted-foreground'>Balance</span>
            <span className={`text-2xl font-bold ${totalBalance < 0 && 'text-red-500'}`}>
              ${getFormatNumber(totalBalance)}
            </span>
          </div>
        </CardLayout>
        <CardLayout>
          <div className='flex justify-evenly h-full'>
            <div className='flex flex-col items-center'>
              <span className='text-sm text-muted-foreground'>Income</span>
              <span className='text-xl font-bold'>
                ${getFormatNumber(totalIncome)}
              </span>
            </div>
            <Separator orientation='vertical'  />
            <div className='flex flex-col items-center'>
              <span className='text-sm text-muted-foreground'>Expense</span>
              <span className='text-xl font-bold'>
                ${getFormatNumber(totalExpense)}
              </span>
            </div>
          </div>
        </CardLayout>
      </section>
      <div className='shadow-sm'>
        <TransactionTable />
      </div>
      <ThemeButton />
    </main>
  );
};

export default Dashboard;
