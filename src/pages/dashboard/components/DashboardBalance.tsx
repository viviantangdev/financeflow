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
    <Card>
      <CardHeader>
        <CardTitle>Total balance</CardTitle>
        <CardDescription>Across all accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <span className='text-2xl'>{formatCurrency(totalAccountBalance)}</span>
      </CardContent>
    </Card>
  );
};
