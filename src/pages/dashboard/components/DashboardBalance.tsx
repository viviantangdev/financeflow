import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAccount } from '@/context/accountContext';
import { formatCurrency } from '@/lib/helpers';

export const DashboardBalance = () => {
  const { totalAccountBalance } = useAccount();
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='text-center'>Total balance</CardTitle>
        <CardDescription className='text-center'>
          Across all accounts
        </CardDescription>
      </CardHeader>
      <CardContent className='flex items-center h-full'>
        <span className='text-2xl text-center w-full'>{formatCurrency(totalAccountBalance)}</span>
      </CardContent>
    </Card>
  );
};
