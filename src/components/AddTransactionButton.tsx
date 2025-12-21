import type { CategoryItem } from '@/context/categoryContext';
import {
  useTransaction,
  type TransactionType,
} from '@/context/transactionContext';
import { useDialog } from '@/hooks/useDialog';
import { formatDateToYYYYMMDD, getSignedAmount } from '@/lib/helpers';
import { ActionButton } from './ActionButton';
import AddTransactionForm from './AddTransactionForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const AddTransactionButton = () => {
  const { isDialogOpen, setIsDialogOpen } = useDialog();
  const { addTransaction } = useTransaction();

  const handleSubmit = (data: {
    description: string;
    amount: string;
    type: TransactionType;
    category: CategoryItem;
    date: Date;
  }) => {
    addTransaction({
      description: data.description,
      amount: getSignedAmount(Number(data.amount), data.type),
      category: data.category,
      type: data.type,
      date: formatDateToYYYYMMDD(data.date),
    });

    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <ActionButton text='Add transaction' />
      </DialogTrigger>
      <DialogContent className='sm:max-w-106'>
        <DialogHeader>
          <DialogTitle className='uppercase'>Add transaction</DialogTitle>
        </DialogHeader>
        <AddTransactionForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionButton;
