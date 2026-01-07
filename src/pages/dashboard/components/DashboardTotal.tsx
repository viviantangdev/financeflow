import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTransaction } from '@/context/transactionContext';
import { formatCurrency } from '@/lib/helpers';
import { ArrowDown, ArrowUp, MoveRight, PiggyBank } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardTotal = () => {
  const { balance, income, expense } = useTransaction();

  const balanceAmount = formatCurrency(balance);

  const incomeAmount = formatCurrency(income);
  const expenseAmount = formatCurrency((expense));

  return (
    <section>
      <Link to={'/cashflow'}>
        <Card className='group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5'>
          <CardHeader>
            <CardTitle>Total overview</CardTitle>
            <CardDescription>Showing totals from All time</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-wrap gap-2'>
            <div className='flex-1 flex flex-col justify-center items-center gap-2 p-3 border rounded-lg'>
              <div className='flex items-center gap-3'>
                <PiggyBank />
                <span className='text-sm text-muted-foreground'>Balance</span>
              </div>
              <span
                className={`text-lg font-bold text-shadow-2xs
                 ${balance === 0 && 'text-foreground'}
                 ${balance < 0 && 'text-red-500'}
                 ${balance > 0 && 'text-emerald-500'}`}
              >
                {balanceAmount}
              </span>
            </div>

            <div className='flex-1 flex flex-col justify-center items-center gap-2 p-3 border rounded-lg'>
              <div className='flex items-center gap-3'>
                <ArrowUp className='text-emerald-500' />
                <span className='text-sm text-muted-foreground'>Income</span>
              </div>
              <span className='text-lg font-bold text-shadow-2xs text-emerald-500'>
                {incomeAmount}
              </span>
            </div>
            <div className='flex-1 flex flex-col justify-center items-center gap-2 p-3 border rounded-lg'>
              <div className='flex items-center gap-3'>
                <ArrowDown className='text-red-500' />
                <span className='text-sm text-muted-foreground'>Expense</span>
              </div>
              <span className='text-lg font-bold text-shadow-2xs text-red-500'>
                {expenseAmount}
              </span>
            </div>
          </CardContent>
          <CardFooter className='flex items-center gap-2'>
            <span className='text-sm font-medium '>View more</span>
            <MoveRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
          </CardFooter>
        </Card>
      </Link>
    </section>
  );
};
