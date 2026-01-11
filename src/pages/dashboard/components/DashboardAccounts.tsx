import { ActionButton } from '@/components/button/ActionButton';
import { FormDialog } from '@/components/dialog/FormDialog';
import { AccountForm } from '@/components/form/AccountForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { useAccount, type AccountBase } from '@/context/accountContext';
import { useDialog } from '@/hooks/useDialog';
import { formatCompactNumber } from '@/lib/helpers';
import { CreditCard, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const DashboardAccounts = () => {
  const { accounts, addAccount } = useAccount();

  const { isDialogOpen, setIsDialogOpen } = useDialog();

  /**Handle dialog */
  const openDialog = () => {
    setIsDialogOpen(true);
  };
  /**Handle new account*/
  const handleAddAccount = (data: AccountBase) => {
    addAccount(data);
    toast.success('Account has been created');
  };

  if (accounts.length === 0)
    return (
      <>
        <Card className='border-2 border-dashed bg-card'>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                <CreditCard />
              </EmptyMedia>
              <EmptyTitle>No accounts Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any accounts yet. Get started by
                creating your first account.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <ActionButton onClick={openDialog} text={'Create account'} />
            </EmptyContent>
          </Empty>
        </Card>
        {/**Dialogs */}
        {/* New account dialog */}
        {isDialogOpen && (
          <FormDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            title='New account'
            description='Enter the name and current balance for your new account.'
          >
            <AccountForm
              onSubmit={handleAddAccount}
              onCancel={() => setIsDialogOpen(false)}
            />
          </FormDialog>
        )}
      </>
    );

  return (
    <div className='flex gap-3 overflow-scroll py-1'>
      {/**Account cards */}
      {accounts.map((item) => (
        <Link to={'/account'}>
          <Card key={item.id} className='min-w-62.5 transition-shadow duration-300 cursor-pointer hover:shadow-md hover:shadow-blue-400/50 '>
            <CardHeader>
              <CardTitle className='uppercase text-md font-normal'>
                {item.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-2'>
                <span className='text-xl'>
                  ${formatCompactNumber(item.balance)}
                </span>
                <span className='text-muted-foreground text-sm'>Balance</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
      {/**New account card */}
      <Card
        onClick={openDialog}
        className='group min-w-62.5 border-dashed border-2 bg-card hover:cursor-pointer hover:border-blue-400 hover:scale-99 transition-all'
      >
        <div className='flex items-center justify-center h-full'>
          <CardContent>
            <div className='flex flex-col items-center'>
              <Plus className='transition-all group-hover:scale-110' />
              <span className='text-muted-foreground transition-all  group-hover:text-primary'>
                New account
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
      {/**Dialogs */}
      {/* New account dialog */}
      {isDialogOpen && (
        <FormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title='New account'
          description='Enter the name and current balance for your new account.'
        >
          <AccountForm
            onSubmit={handleAddAccount}
            onCancel={() => setIsDialogOpen(false)}
          />
        </FormDialog>
      )}
    </div>
  );
};
