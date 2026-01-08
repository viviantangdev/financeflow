import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/helpers';
import { ArrowDown, ArrowUp } from 'lucide-react';

type CashFlowTotalsProps = {
  balance: number;
  income: number;
  expense: number;
};
export const CashFlowTotals = ({
  balance,
  income,
  expense,
}: CashFlowTotalsProps) => {
  const balanceAmount = formatCurrency(balance);
  const incomeAmount = formatCurrency(income);
  const expenseAmount = formatCurrency(expense);
  return (
    <div className='flex flex-wrap gap-2'>
      <Card className='flex-1'>
        <CardHeader>
          <CardTitle>
            <span className='font-normal'>Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className='font-bold'>{balanceAmount}</span>
        </CardContent>
      </Card>
      <Card className='flex-1'>
        <CardHeader>
          <CardTitle>
            <div className='flex items-center gap-1'>
              <ArrowUp size={20} className='text-emerald-500' />
              <span className='font-normal'>Income</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className='font-bold'>{incomeAmount}</span>
        </CardContent>
      </Card>
      <Card className='flex-1'>
        <CardHeader>
          <CardTitle>
            <div className='flex items-center gap-1'>
              <ArrowDown size={20} className='text-red-500' />
              <span className='font-normal'>Expense</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className='font-bold'>{expenseAmount}</span>
        </CardContent>
      </Card>
    </div>
  );
};
