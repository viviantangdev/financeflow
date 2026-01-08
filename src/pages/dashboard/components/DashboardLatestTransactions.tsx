import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTransaction } from '@/context/transactionContext';
import { formatCurrency } from '@/lib/helpers';
import { iconMap } from '@/lib/icons';
import { format } from 'date-fns';
import { MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardLatestTransactions = () => {
  const { transactions } = useTransaction();
  // const latestItems = transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Transactions</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {transactions.map((item) => {
          const Icon = iconMap[item.category.iconName];

          return (
            <div key={item.id} className='space-y-3'>
              <div className='flex flex-row items-end'>
                <div className='flex flex-1 gap-3'>
                  <div className='flex items-center justify-center iconBadge'>
                    <Icon size={20} />
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <span>{item.description}</span>
                    <span className='text-sm text-muted-foreground'>
                      {format(item.date, 'MMMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                <span
                  className={`${
                    item.amount > 0 ? 'text-emerald-500' : 'text-red-500'
                  }`}
                >
                  {formatCurrency(item.amount, { compact: false })}
                </span>
              </div>
              <Separator />
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Link to={'/transactions'}>
          <Button type='button' variant={'ghost'} className='group'>
            <span className='text-sm font-medium '>View all transactions</span>
            <MoveRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
