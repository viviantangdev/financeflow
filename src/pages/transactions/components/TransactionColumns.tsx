// columns.ts or inside the component
import { Badge } from '@/components/ui/badge';
import type {
  TransactionItem,
  TransactionType,
} from '@/context/transactionContext';
import { type ColumnDef } from '@tanstack/react-table';
import { TableColumnHeader } from './TableColumnHeader';

export const columns: ColumnDef<TransactionItem>[] = [
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
        <TableColumnHeader column={column} title='Amount' />
      </div>
    ),

    sortingFn: (rowA, rowB) => {
      const absA = Math.abs(rowA.original.amount);
      const absB = Math.abs(rowB.original.amount);
      return absB - absA || rowA.index - rowB.index; // fallback to original order
    },
    cell: ({ row }) => {
      const amount = Math.abs(row.getValue<number>('amount'));
      const type = row.original.type;

      return (
        <div className={`text-right font-medium`}>
          {type === 'Income' ? '+' : '-'}${amount}
        </div>
      );
    },
  },
];
