// components/tables/TransactionTableCore.tsx
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
  type TransactionBase,
  type TransactionItem,
} from '@/context/transactionContext';
import { useDialog } from '@/hooks/useDialog';
import { formatCurrency } from '@/lib/helpers';
import { TransactionDialog } from '@/pages/transactions/components/TransactionDialog';
import { flexRender, type Table as TanStackTable } from '@tanstack/react-table';
import { toast } from 'sonner';
import { columns as baseColumns } from './TransactionColumns';
import { TransactionForm } from '../TransactionForm';

type TransactionTableProps = {
  table: TanStackTable<TransactionItem>;
  hasTransactions: boolean;
};

export function TransactionTable({
  table,
  hasTransactions,
}: TransactionTableProps) {
  const { isDialogOpen, setIsDialogOpen } = useDialog();
  const { addTransaction } = useTransaction();

  const handleAddTransaction = (data: TransactionBase) => {
    const signedAmount = data.type === 'Income' ? data.amount : -data.amount;
    addTransaction({
      description: data.description,
      amount: signedAmount,
      category: data.category,
      type: data.type,
      date: data.date,
    });
    toast.success('Transaction has been created');
  };

  // Calculate balance from currently visible (filtered) rows
  const visibleBalance = table
    .getFilteredRowModel()
    .rows.reduce((sum, row) => sum + row.original.amount, 0);

  const footerAmount = formatCurrency(visibleBalance, { compact: false });

  const footerColor =
    visibleBalance > 0
      ? 'text-emerald-600'
      : visibleBalance < 0
      ? 'text-red-600'
      : 'text-foreground';

  return (
    <Table className='rounded-lg overflow-hidden'>
      <TableHeader className='bg-secondary'>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {hasTransactions ? (
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
            <TableCell
              colSpan={baseColumns.length + 1}
              className='text-center py-12'
            >
              <div className='flex flex-col items-center gap-4'>
                <p className='text-lg text-muted-foreground'>
                  No transactions yet.
                </p>
                <ActionButton
                  text='Add transaction'
                  onClick={() => setIsDialogOpen(!isDialogOpen)}
                />
                <TransactionDialog
                  open={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                  title='Add transaction'
                  description='Enter the details for your new transaction.'
                >
                  <TransactionForm
                    onSubmit={handleAddTransaction}
                    onCancel={() => setIsDialogOpen(!isDialogOpen)}
                  />
                </TransactionDialog>
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
          <TableCell className={`text-right font-bold ${footerColor}`}>
            {footerAmount}
          </TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  );
}
