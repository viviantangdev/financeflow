/* eslint-disable react-hooks/incompatible-library */
import { ActionButton } from '@/components/ActionButton';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useTransaction,
  type TransactionItem,
} from '@/context/transactionContext';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { TransactionDialog } from '../../TransactionDialog';
import { Button } from '../../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import { columns } from './TransactionColumns';

const TransactionTable = () => {
  const { transactions, balance, deleteTransaction } = useTransaction();
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
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const footerAmount =
    balance === 0
      ? '$0'
      : balance > 0
      ? `+$${balance}`
      : `-$${Math.abs(balance)}`;

  return (
    <Table >
      <TableHeader className='bg-secondary'>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columnsWithActions.length}>
              <div className='flex flex-col justify-center items-center p-6 gap-2'>
                <p>No transactions yet.</p>
                <TransactionDialog
                  trigger={<ActionButton text='Create transaction' />}
                />
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>

      <TableFooter className='bg-secondary'>
        <TableRow>
          <TableCell colSpan={4} className='font-semibold'>
            Balance
          </TableCell>
          <TableCell
            className={`text-right font-bold ${
              balance > 0
                ? 'text-emerald-600'
                : balance < 0
                ? 'text-red-600'
                : 'text-foreground'
            }`}
          >
            {footerAmount}
          </TableCell>
          <TableCell /> {/* Empty for actions column */}
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default TransactionTable;
