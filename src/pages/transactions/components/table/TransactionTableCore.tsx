/* eslint-disable react-hooks/incompatible-library */
// components/tables/TransactionTable.tsx
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
import { Edit2, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { columns } from './TransactionColumns';
import { TransactionFilters } from './TransactionFilters';
import { TransactionTable } from './TransactionTable';

type TransactionTableCoreProps = {
  onEdit: (transaction: TransactionItem) => void;
  onView: (transaction: TransactionItem) => void;
  onDelete: (transaction: TransactionItem) => void;
};

export function TransactionTableCore({
  onEdit,
  onDelete,
  onView,
}: TransactionTableCoreProps) {
  const { transactions } = useTransaction();

  const [sorting, setSorting] = useState<SortingState>([]);

  const columnsWithActions: ColumnDef<TransactionItem>[] = [
    ...columns,
    {
      id: 'actions',
      // header: () => <div className='text-center'>Actions</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const item = row.original as TransactionItem;

        return (
          <div className='flex items-center justify-end gap-1'>
            {/* Edit */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => onEdit(item)}
                  className='h-8 w-8'
                >
                  <Edit2 className='h-4 w-4' />
                  <span className='sr-only'>Edit</span>
                </Button>
              </TooltipTrigger>

              <TooltipContent side='top'>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>

            {/* Delete */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => onDelete(item)}
                  className='h-8 w-8'
                >
                  <Trash2 className='h-4 w-4' />
                  <span className='sr-only'>Delete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
            {/* View */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => onView(item)}
                  className='h-8 w-8'
                >
                  <Eye className='h-4 w-4' />
                  <span className='sr-only'>View</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>
                <p>View</p>
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
