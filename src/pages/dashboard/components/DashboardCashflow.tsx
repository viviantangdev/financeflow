import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTransaction } from '@/context/transactionContext';
import { formatCurrency } from '@/lib/helpers';
import { ArrowDown, ArrowUp } from 'lucide-react';

export const DashboardCashflow = () => {
  const { balance, income, expense } = useTransaction();
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span>Cash Flow</span>
        </CardTitle>
        <CardDescription>
          <span className='text-muted-foreground'>
            All time (Income vs Expense)
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-5'>
          <div>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-1'>
                <ArrowUp size={20} className='text-emerald-500' />
                <span>Income</span>
              </div>
              <span>{formatCurrency(income)}</span>
            </div>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-1'>
                <ArrowDown size={20} className='text-red-500' />
                <span>Expense</span>
              </div>
              <span>{formatCurrency(expense)}</span>
            </div>
          </div>
          <Separator />
          <div className='flex justify-between items-center'>
            <span>Net</span>
            <span
              className={`${balance === 0 && 'text-foreground'} ${
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
