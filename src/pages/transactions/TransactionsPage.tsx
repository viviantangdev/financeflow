import { ActionButton } from '@/components/button/ActionButton';
import { FormDialog } from '@/components/dialog/FormDialog';
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
  useTransaction,
  type TransactionBase,
  type TransactionItem,
} from '@/context/transactionContext';
import { useDialog } from '@/hooks/useDialog';
import { formatCurrency } from '@/lib/helpers';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { TransactionForm } from '../../components/form/TransactionForm';
import { TransactionTableCore } from './components/table/TransactionTableCore';

type DialogMode = 'add' | 'edit' | 'view' | 'delete';

export const TransactionsPage = () => {
  const { addTransaction, updateTransaction, deleteTransaction } =
    useTransaction();
  const { isDialogOpen, setIsDialogOpen } = useDialog();
  const [dialogMode, setDialogMode] = useState<DialogMode>('add');
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionItem | null>(null);

  const openAdd = () => {
    setDialogMode('add');
    setSelectedTransaction(null);
    setIsDialogOpen(true);
  };

  const openView = (transaction: TransactionItem) => {
    setDialogMode('view');
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const openEdit = (transaction: TransactionItem) => {
    setDialogMode('edit');
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const openDelete = (transaction: TransactionItem) => {
    setDialogMode('delete');
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

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

  const handleEdit = (data: TransactionBase) => {
    const signedAmount = data.type === 'Income' ? data.amount : -data.amount;
    updateTransaction(selectedTransaction!.id, {
      description: data.description,
      amount: signedAmount,
      category: data.category,
      type: data.type,
      date: data.date,
    });
    toast.success('Transaction has been updated');
  };

  const handleDelete = (item: TransactionItem) => {
    deleteTransaction(item.id);
    toast.success('Transaction has been deleted');
  };

  return (
    <div className='space-y-10'>
      <section>
        <ActionButton text='New transaction' onClick={openAdd} />
      </section>

      {/* Table with filters */}
      <section>
        <TransactionTableCore
          onEdit={openEdit}
          onDelete={openDelete}
          onView={openView}
        />
      </section>

      {/* Add transaction dialog */}
      {dialogMode === 'add' && (
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
      {/* Edit transaction Dialog */}
      {dialogMode === 'edit' && (
        <FormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title='Edit transaction'
          description='Update the details of this transaction.'
        >
          <TransactionForm
            transaction={selectedTransaction!}
            onSubmit={handleEdit}
            onCancel={() => setIsDialogOpen(!isDialogOpen)}
          />
        </FormDialog>
      )}
      {/* View transaction Dialog */}
      {dialogMode === 'view' && (
        <FormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title='View transaction'
          description='Transaction details.'
          footer={
            <Button
              variant='default'
              className='primaryButton'
              onClick={() => openEdit(selectedTransaction!)}
            >
              Edit
            </Button>
          }
        >
          <div>
            <p>Type: {selectedTransaction!.type}</p>
            <p>Description: {selectedTransaction!.description}</p>
            <p>
              Amount:
              {formatCurrency(selectedTransaction!.amount, {
                compact: false,
              })}
            </p>
            <p>Category: {selectedTransaction!.category.name}</p>
            <p>Date: {selectedTransaction!.date}</p>
          </div>
        </FormDialog>
      )}
      {/* Delete transaction AlertDialog */}
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
                  <p>You´re about to delete below transaction:</p>
                  <div>
                    <p>Type: {selectedTransaction!.type}</p>
                    <p>Description: {selectedTransaction!.description}</p>
                    <p>
                      Amount:
                      {formatCurrency(selectedTransaction!.amount, {
                        compact: false,
                      })}
                    </p>
                    <p>Category: {selectedTransaction!.category.name}</p>
                    <p>Date: {selectedTransaction!.date}</p>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(selectedTransaction!)}
                className='errorButton'
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
