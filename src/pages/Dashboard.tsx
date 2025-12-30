import { Separator } from '@/components/ui/separator';
import { useTransaction } from '@/context/transactionContext';
import { getFormatNumber } from '@/lib/helpers';

const Dashboard = () => {
  const { balance, income, expense } = useTransaction();

  const balanceAmount =balance === 0 ? `$${balance}` :
    balance > 0
      ? `+$${getFormatNumber(balance)}`
      : `-$${getFormatNumber(Math.abs(balance))}`;

  return (
    <div className='flex flex-col gap-5'>
      <section className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <div className='flex flex-col items-center containerLayout'>
          <span className='text-sm text-muted-foreground'>Balance</span>
          <span
            className={`text-2xl font-bold ${balance < 0 && 'text-red-500'}`}
          >
            {balanceAmount}
          </span>
        </div>

        <div className='flex justify-evenly h-full containerLayout'>
          <div className='flex flex-col items-center'>
            <span className='text-sm text-muted-foreground'>Income</span>
            <span className='text-xl font-bold'>
              ${getFormatNumber(income)}
            </span>
          </div>
          <Separator orientation='vertical' />
          <div className='flex flex-col items-center'>
            <span className='text-sm text-muted-foreground'>Expense</span>
            <span className='text-xl font-bold'>
              ${getFormatNumber(expense)}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
