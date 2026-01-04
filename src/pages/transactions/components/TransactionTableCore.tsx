/* eslint-disable react-hooks/incompatible-library */
// components/tables/TransactionTable.tsx
import { TransactionDialog } from '@/components/TransactionDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  useTransaction,
  type TransactionItem,
} from '@/context/transactionContext';
import { formatCurrency } from '@/lib/helpers';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { columns } from './TransactionColumns';
import { TransactionFilters } from './TransactionFilters';
import { TransactionTable } from './TransactionTable';

export function TransactionTableCore() {
  const { transactions, deleteTransaction } = useTransaction();
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleDelete = (item: TransactionItem) => {
    toast.success('Transaction has been deleted');
    deleteTransaction(item.id);
  };

  const columnsWithActions: ColumnDef<TransactionItem>[] = [
    ...columns,
    {
      id: 'actions',
      header: () => <div className='text-right'>Actions</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const item = row.original as TransactionItem;

        return (
          <div className='flex items-center justify-end gap-1'>
            <Tooltip>
              <TransactionDialog
                transaction={item}
                trigger={
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                      <Edit2 className='h-4 w-4' />
                      <span className='sr-only'>Edit</span>
                    </Button>
                  </TooltipTrigger>
                }
              />
              <TooltipContent side='top'>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                      <Trash2 className='h-4 w-4' />
                      <span className='sr-only'>Delete</span>
                    </Button>
                  </AlertDialogTrigger>
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
                            <p>Description: {item.description}</p>
                            <p>
                              Amount:{' '}
                              {formatCurrency(item.amount, { compact: false })}
                            </p>
                            <p>Category: {item.category.name}</p>
                            <p>Date: {item.date}</p>
                          </div>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item)}
                        className='errorButton'
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent side='top'>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: transactions,
    columns: columnsWithActions,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <>
      <TransactionFilters table={table} />
      <TransactionTable
        table={table}
        hasTransactions={transactions.length > 0}
      />
    </>
  );
}
