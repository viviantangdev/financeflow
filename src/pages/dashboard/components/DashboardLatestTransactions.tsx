import { ActionButton } from '@/components/button/ActionButton';
import { FormDialog } from '@/components/dialog/FormDialog';
import { TransactionForm } from '@/components/form/TransactionForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Separator } from '@/components/ui/separator';
import {
  useTransaction,
  type TransactionBase,
} from '@/context/transactionContext';
import { useDialog } from '@/hooks/useDialog';
import { formatCurrency } from '@/lib/helpers';
import { iconMap } from '@/lib/icons';
import { format } from 'date-fns';
import { MoveRight, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const DashboardLatestTransactions = () => {
  const { transactions, addTransaction } = useTransaction();
  const latestItems = transactions.slice(0, 5);
  const { isDialogOpen, setIsDialogOpen } = useDialog();

  /**Handle dialog */
  const openDialog = () => {
    setIsDialogOpen(true);
  };
  /**Handle new transaction*/
  const handleAddTransaction = (data: TransactionBase) => {
    const signedAmount = data.type === 'Income' ? data.amount : -data.amount;
    addTransaction({
      description: data.description,
      amount: signedAmount,
      category: data.category,
      type: data.type,
      account: data.account,
      date: data.date,
    });
    toast.success('Transaction has been created');
  };

  if (transactions.length === 0)
    return (
      <>
        <Card className='border-2 border-dashed bg-card'>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                <Receipt />
              </EmptyMedia>
              <EmptyTitle>No transactions Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any transactions yet. Get started by
                creating your first transaction.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <ActionButton onClick={openDialog} text={'Create transaction'} />
            </EmptyContent>
          </Empty>
        </Card>
        {/**Dialogs */}
        {/* New transaction dialog */}
        {isDialogOpen && (
          <FormDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            title='New transaction'
            description='Enter the details for your new transaction.'
          >
            <TransactionForm
              onSubmit={handleAddTransaction}
              onCancel={() => setIsDialogOpen(!isDialogOpen)}
            />
          </FormDialog>
        )}
      </>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Transactions</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {latestItems.map((item) => {
          const Icon = iconMap[item.category.iconName];

          return (
            <div key={item.id} className='space-y-3'>
              <div className='flex flex-row items-end justify-between'>
                <div className='flex gap-3 items-center'>
                  <Icon className='iconBadge' />
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
