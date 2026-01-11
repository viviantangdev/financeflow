import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type {
  TransactionItem,
  TransactionType,
} from '@/context/transactionContext';
import { type ColumnDef } from '@tanstack/react-table';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import { TableColumnHeader } from './TableColumnHeader';

const TableColumns: ColumnDef<TransactionItem>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => <TableColumnHeader column={column} title='Date' />,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      const description: string = row.getValue('description');

      return (
        <div className='max-w-25 truncate' title={description}>
          {description}
        </div>
      );
    },
  },
  {
    id: 'category',
    accessorKey: 'category',
    accessorFn: (row) => row.category.id, // ← Filter by category ID
    filterFn: 'arrIncludesSome', // allows multi-select
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row }) => {
      const category = row.original.category.name;

      return (
        <div className='max-w-25 truncate' title={category}>
          {category}
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => <TableColumnHeader column={column} title='Type' />,
    cell: ({ row }) => {
      const type: TransactionType = row.getValue('type');
      return (
        <Badge
          className={`${
            type === 'Income'
              ? 'bg-emerald-500 dark:bg-emerald-400/50  text-white'
              : 'bg-red-500 dark:bg-red-400/50 text-white'
          }`}
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <div className='text-right'>
        <TableColumnHeader column={column} title='Amount ($)' />
      </div>
    ),

    sortingFn: (rowA, rowB, columnId) => {
      const a = Math.abs(rowA.getValue(columnId));
      const b = Math.abs(rowB.getValue(columnId));
      return a - b || rowA.index - rowB.index;
    },
    cell: ({ row }) => {
      const amount = row.getValue<number>('amount');

      return (
        <div
          className={`text-right font-medium ${
            amount > 0 ? `text-emerald-500` : `text-red-500`
          }`}
        >
          {amount > 0 ? `+${amount}` : amount}
        </div>
      );
    },
  },
];

type TableColumnsWithActionsProps = {
    onEdit: (data: TransactionItem) => void,
  onView: (data: TransactionItem) => void,
  onDelete: (data: TransactionItem) => void
}

export const TableColumnsWithActions =(
 {onEdit, onDelete, onView}: TableColumnsWithActionsProps
) => {
  return [
    ...TableColumns,
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
  ] as ColumnDef<TransactionItem>[];
}
