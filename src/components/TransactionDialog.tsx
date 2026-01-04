import {
  useTransaction,
  type TransactionBase,
  type TransactionItem,
} from '@/context/transactionContext';
import { useDialog } from '@/hooks/useDialog';
import React from 'react';
import { toast } from 'sonner';
import TransactionForm from './TransactionForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Separator } from './ui/separator';

type TransactionDialogProps = {
  transaction?: TransactionItem; // provided = edit mode
  trigger: React.ReactNode;
};

export const TransactionDialog = ({
  transaction,
  trigger,
}: TransactionDialogProps) => {
  const { isDialogOpen, setIsDialogOpen } = useDialog();

  const { addTransaction, updateTransaction } = useTransaction();
  const isEditMode = !!transaction;

  const handleSubmit = (data: TransactionBase) => {
    const signedAmount = data.type === 'Income' ? data.amount : -data.amount;

    if (isEditMode) {
      updateTransaction(transaction.id, {
        description: data.description,
        amount: signedAmount,
        category: data.category,
        type: data.type,
        date: data.date,
      });
      toast.success('Transaction has been updated');
    } else {
      addTransaction({
        description: data.description,
        amount: signedAmount,
        category: data.category,
        type: data.type,
        date: data.date,
      });
      toast.success('Transaction has been created');
    }

    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  const title = isEditMode ? 'Edit transaction' : 'Add transaction';

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-106'>
        <DialogHeader>
          <DialogTitle className='uppercase'>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{title}</DialogDescription>
        <Separator />
        <TransactionForm
          transaction={transaction}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
