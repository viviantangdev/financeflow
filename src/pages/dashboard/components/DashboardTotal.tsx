import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useTransaction } from '@/context/transactionContext';
import { getFormatNumber } from '@/lib/helpers';
import { MoveRight, TrendingDown, TrendingUp, TrendingUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardTotal = () => {
  const { balance, income, expense } = useTransaction();

  const balanceAmount =
    balance === 0
      ? `$${balance}`
      : balance > 0
      ? `+$${getFormatNumber(balance)}`
      : `-$${getFormatNumber(Math.abs(balance))}`;

  const incomeAmount = getFormatNumber(income);
  const expenseAmount = getFormatNumber(expense);

  return (
    <section className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
      <Link to={'/cashflow'}>
        <Card className='group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5'>
          <CardContent className='flex flex-col items-center gap-2'>
              <div className='flex items-center gap-2 '>
              <TrendingUpDown/>
              <span className='text-sm text-muted-foreground'>Balance</span>
            </div>
            <span
              className={`text-2xl font-bold 
                ${balance === 0 && 'text-foreground'}
                ${balance < 0 && 'text-red-500'}
                ${balance > 0 && 'text-emerald-500'}`}
            >
              {balanceAmount}
            </span>
          </CardContent>
          <CardFooter className='flex items-center justify-center gap-2'>
            <span className='text-sm font-medium '>View more</span>
            <MoveRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
          </CardFooter>
        </Card>
      </Link>
      <div className='grid grid-cols-2 gap-2'>
        <Link to={'/cashflow'}>
          <Card className='group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5'>
            <CardContent className='flex flex-col items-center gap-2'>
              <div className='flex items-center gap-2 '>
                <TrendingUp className='text-emerald-500' />
                <span className='text-sm text-muted-foreground'>Income</span>
              </div>
              <span className='text-2xl font-bold'>${incomeAmount}</span>
            </CardContent>
            <CardFooter className='flex items-center justify-center gap-2'>
              <span className='text-sm font-medium '>View more</span>
              <MoveRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </CardFooter>
          </Card>
        </Link>
        <Link to={'/cashflow'}>
          <Card className='group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5'>
            <CardContent className='flex flex-col items-center gap-2'>
              <div className='flex items-center gap-2 '>
                <TrendingDown className='text-red-500' />
                <span className='text-sm text-muted-foreground'>Expense</span>
              </div>
              <span className='text-2xl font-bold'>${expenseAmount}</span>
            </CardContent>
            <CardFooter className='flex items-center justify-center gap-2'>
              <span className='text-sm font-medium '>View more</span>
              <MoveRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </CardFooter>
          </Card>
        </Link>
      </div>
    </section>
  );
};
