import { useState } from 'react';

import {
  useFinance,
  type CategoryType,
  type TransactionType,
} from '@/context/financeContext';
import { formatDateToYYYYMMDD, getSignedAmount } from '@/lib/helpers';
import { Plus } from 'lucide-react';
import AddTransactionForm from './AddTransactionForm';
import { Button } from './ui/button';
import { Dialog, DialogTrigger } from './ui/dialog';

const AddTransactionButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { addTransaction } = useFinance();

  const handleSubmit = (data: {
    description: string;
    amount: string;
    type: TransactionType;
    category: CategoryType;
    date: Date;
  }) => {
    addTransaction({
      description: data.description,
      amount: getSignedAmount(Number(data.amount), data.type),
      category: data.category,
      type: data.type,
      date: formatDateToYYYYMMDD(data.date),
    });

    setDialogOpen(false);
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button type='button' variant={'default'} size={'lg'}>
          <Plus />
          Add transaction
        </Button>
      </DialogTrigger>

      {dialogOpen && (
        <AddTransactionForm onSubmit={handleSubmit} onCancel={handleCancel} />
      )}
    </Dialog>
  );
};

export default AddTransactionButton;
