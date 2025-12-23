import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTransaction } from '@/context/transactionContext';
import { Edit } from 'lucide-react';
import { TransactionDialog } from './TransactionDialog';

const TransactionTable = () => {
  const { transactions, balance } = useTransaction();

  const sign = (amount: number): string => {
    return amount < 0 ? `$${amount}` : `+$${amount}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className='text-right'>Amount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item.date}</TableCell>
            <TableCell>{item.category.name}</TableCell>
            <TableCell className='text-right'>{sign(item.amount)}</TableCell>
            <TableCell>
              <TransactionDialog trigger={<Edit />} transaction={item} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className='text-right'>{sign(balance)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default TransactionTable;
