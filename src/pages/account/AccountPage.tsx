import { FormDialog } from '@/components/dialog/FormDialog';
import { AccountForm } from '@/components/form/AccountForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useAccount,
  type AccountBase,
  type AccountItem,
} from '@/context/accountContext';
import { useDialog } from '@/hooks/useDialog';
import { formatCompactNumber } from '@/lib/helpers';
import { Edit2, Ellipsis, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type DialogMode = 'add' | 'edit' | 'delete';

export const AccountPage = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccount();
  const { isDialogOpen, setIsDialogOpen } = useDialog();
  const [dialogMode, setDialogMode] = useState<DialogMode>('add');
  const [selectedAccount, setSelectedAccount] = useState<AccountItem | null>(
    null
  );

  const openAdd = () => {
    setDialogMode('add');
    setSelectedAccount(null);
    setIsDialogOpen(true);
  };
  const openEdit = (data: AccountItem) => {
    setDialogMode('edit');
    setSelectedAccount(data);
    setIsDialogOpen(true);
  };

  const openDelete = (data: AccountItem) => {
    setDialogMode('delete');
    setSelectedAccount(data);
    setIsDialogOpen(true);
  };

  const handleAddAccount = (data: AccountBase) => {
    addAccount(data);
    toast.success('Account has been created');
  };
  const handleEditAccount = (data: AccountBase) => {
    updateAccount(selectedAccount!.id, { ...data });
    toast.success('Account has been updated');
  };
  const handleDeleteAccount = (data: AccountItem) => {
    deleteAccount(data.id);
    toast.success('Account has been deleted');
  };

  return (
    <>
      <section>
        <Button type='button' onClick={openAdd}>
          New account
        </Button>
        <Button>Transfer</Button>
      </section>
      <section className='flex flex-wrap gap-3'>
        {accounts.map((item) => (
          <Card className='flex-1'>
            <CardHeader>
              <div className='flex items-end justify-between'>
                <CardTitle className='uppercase'>{item.name}</CardTitle>
                <CardAction>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type='button' variant='outline'>
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-56' align='end'>
                      <DropdownMenuLabel className='text-muted-foreground text-xs'>
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className='mx-1' />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          variant='default'
                          onClick={() => openEdit(item)}
                          className='cursor-pointer'
                        >
                          <Edit2 />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant='destructive'
                          onClick={() => openDelete(item)}
                          className='cursor-pointer'
                        >
                          <Trash2 />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardAction>
              </div>
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
      </section>
      {/* New card dialog */}
      {dialogMode === 'add' && (
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
      {/* Edit account Dialog */}
      {dialogMode === 'edit' && (
        <FormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title='Edit account'
          description='Update the name and/or balance of this account.'
        >
          <AccountForm
            account={selectedAccount!}
            onSubmit={handleEditAccount}
            onCancel={() => setIsDialogOpen(false)}
          />
        </FormDialog>
      )}
      {/* Delete account AlertDialog */}
      {dialogMode === 'delete' && (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className='flex items-center gap-2'>
                  <Trash2 className='h-4 w-4' />
                  <p> Are you absolutely sure?</p>
                </div>
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div className='space-y-3'>
                  <p>You´re about to delete account: {selectedAccount?.name}</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteAccount(selectedAccount!)}
                className='errorButton'
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
