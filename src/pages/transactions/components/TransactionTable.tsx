// components/tables/TransactionTableCore.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type TransactionItem } from '@/context/transactionContext';
import { formatCurrency } from '@/lib/helpers';
import { flexRender, type Table as TanStackTable } from '@tanstack/react-table';

type TransactionTableProps = {
  table: TanStackTable<TransactionItem>;
};

export function TransactionTable({ table }: TransactionTableProps) {
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

      <TableBody className='bg-card'>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
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
