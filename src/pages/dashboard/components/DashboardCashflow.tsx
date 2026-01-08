import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTransaction } from '@/context/transactionContext';
import { formatCurrency } from '@/lib/helpers';
import { ArrowDown, ArrowUp, MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardCashflow = () => {
  const { balance, income, expense } = useTransaction();
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>
          <span>Cash Flow</span>
        </CardTitle>
        <CardDescription>
          <span className='text-muted-foreground'>
            All time (Income vs Expense)
          </span>
        </CardDescription>
        <CardAction>
          <Link to={'/cashflow'}>
            <Button type='button' variant={'ghost'} className='group'>
              <span className='text-sm font-medium '>View more</span>
              <MoveRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Button>
          </Link>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className='space-y-5'>
          <div className='space-y-1'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-1'>
                <ArrowUp size={20} className='text-emerald-500' />
                <span className='text-muted-foreground'>Income</span>
              </div>
              <span>{formatCurrency(income)}</span>
            </div>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-1'>
                <ArrowDown size={20} className='text-red-500' />
                <span className='text-muted-foreground'>Expense</span>
              </div>
              <span>{formatCurrency(expense)}</span>
            </div>
          </div>
          <Separator />
          <div className='flex justify-between items-center'>
            <span>Net balance</span>
            <span
              className={`font-bold ${balance === 0 && 'text-foreground'} ${
                balance > 0 && 'text-emerald-500'
              } ${balance < 0 && 'text-red-500'}`}
            >
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
