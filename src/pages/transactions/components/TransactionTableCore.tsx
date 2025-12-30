/* eslint-disable react-hooks/incompatible-library */
// components/tables/TransactionTable.tsx
import { TransactionDialog } from '@/components/TransactionDialog';
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
import { columns } from './TransactionColumns';
import { TransactionFilters } from './TransactionFilters';
import { TransactionTable } from './TransactionTable';

export function TransactionTableCore() {
  const { transactions, deleteTransaction } = useTransaction();
  const [sorting, setSorting] = useState<SortingState>([]);

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
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => deleteTransaction(item.id)}
                >
                  <Trash2 className='h-4 w-4' />
                  <span className='sr-only'>Delete</span>
                </Button>
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
