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
import { Card } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  useTransaction,
  type TransactionBase,
  type TransactionItem,
} from '@/context/transactionContext';
import { useDialog } from '@/hooks/useDialog';
import { formatCurrency } from '@/lib/helpers';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { Receipt, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { TransactionForm } from '../../components/form/TransactionForm';
import { TableColumnsWithActions } from './components/table/TableColumns';
import { TransactionFilters } from './components/TransactionFilters';
import { TransactionTable } from './components/TransactionTable';

export const TransactionsPage = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransaction();
  const { isDialogOpen, setIsDialogOpen } = useDialog();
  const [dialogMode, setDialogMode] = useState<
    'add' | 'edit' | 'view' | 'delete' | undefined
  >(undefined);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionItem | null>(null);

  /**Handle dialog */
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

  /**Handle new, edit, delete transaction*/
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

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: transactions,
    columns: TableColumnsWithActions({
      onEdit: openEdit,
      onDelete: openDelete,
      onView: openView,
    }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

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
              <ActionButton onClick={openAdd} text={'Create transaction'} />
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
    <div className='space-y-10'>
      <section>
        <ActionButton text='New transaction' onClick={openAdd} />
      </section>

      {/* Filters */}
      <section>
        <TransactionFilters table={table} />
      </section>
      {/**Table */}
      <section>
        <TransactionTable table={table} />
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
