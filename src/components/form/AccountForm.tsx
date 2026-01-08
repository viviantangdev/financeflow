import type { AccountBase, AccountItem } from '@/context/accountContext';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

type AccountFormProps = {
  account?: AccountItem; // undefined = new, provided = edit mode
  onSubmit: (data: AccountBase) => void;
  onCancel: () => void;
};

export const AccountForm = ({
  account,
  onSubmit,
  onCancel,
}: AccountFormProps) => {
  const {
    register,
    handleSubmit,

    reset,
    formState: { errors, isSubmitting },
  } = useForm<{
    name: string;
    balance: string;
  }>({
    defaultValues: {
      name: '',
      balance: '',
    },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (account) {
      reset({
        name: account.name,
        balance: Math.abs(account.balance).toString(),
      });
    } else {
      // Reset to empty for new transaction
      reset({
        name: '',
        balance: '',
      });
    }
  }, [account, reset]);

  const onFormSubmit = (data: { name: string; balance: string }) => {
    onSubmit({
      name: data.name,
      balance: Number(data.balance),
    });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='grid gap-8'>
      <FieldGroup>
        {/* Account name */}
        <Field data-invalid={!!errors.name}>
          <FieldLabel>Name</FieldLabel>
          <Input
            {...register('name', {
              required: 'Name is required.',
              minLength: {
                value: 1,
                message: 'Name must be at least 1 character.',
              },
            })}
            placeholder='e.g. Debit'
            className={
              errors.name
                ? 'border-destructive focus-visible:ring-destructive'
                : ''
            }
          />
          {errors.name && <FieldError errors={[errors.name]} />}
        </Field>

        {/* Amount */}
        <Field data-invalid={!!errors.balance}>
          <FieldLabel>Balance</FieldLabel>
          <Input
            {...register('balance', {
              required: 'Balance is required',
              validate: (value) => {
                const num = Number(value);
                return (
                  (!isNaN(num) && num >= 1) || 'Balance must be at least 1'
                );
              },
            })}
            type='number'
            step='0.01'
            placeholder='0'
            className={
              errors.balance
                ? 'border-destructive focus-visible:ring-destructive'
                : ''
            }
          />
          {errors.balance && <FieldError errors={[errors.balance]} />}
        </Field>
      </FieldGroup>

      <DialogFooter>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type='submit'
          variant='default'
          disabled={isSubmitting}
          className='primaryButton'
        >
          {account ? 'Update' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  );
};
