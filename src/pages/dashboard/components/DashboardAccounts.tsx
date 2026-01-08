import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAccount } from '@/context/accountContext';
import { formatCompactNumber } from '@/lib/helpers';
import { MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardAccounts = () => {
  const { accounts } = useAccount();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
        <CardAction>
          <Link to={'/account'}>
            <Button type='button' variant={'ghost'} className='group'>
              <span className='text-sm font-medium '>View all accounts</span>
              <MoveRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-3'>
          {accounts.map((item) => (
            <Card key={item.id} className='min-w-62.5'>
              <CardHeader>
                <CardTitle className='uppercase'>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col gap-2'>
                  <span className='text-2xl'>
                    ${formatCompactNumber(item.balance)}
                  </span>
                  <span className='text-muted-foreground'>Balance</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
