import {
  useAccount,
  type AccountItem,
  type TransferBase,
} from '@/context/accountContext';
import { formatCurrency } from '@/lib/helpers';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { DialogFooter } from '../ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { PopoverContent } from '../ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type TransferFormProps = {
  onSubmit: (data: TransferBase) => void;
  onCancel: () => void;
};

/// Form for transfer
// - Add transfer /
export const TransferForm = ({ onSubmit, onCancel }: TransferFormProps) => {
  const [calenderOpen, setCalenderOpen] = useState(false);
  const { accounts } = useAccount();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{
    amount: string;
    fromAccount: AccountItem;
    toAccount: AccountItem;
    date: Date;
  }>({
    defaultValues: {
      amount: '',
      fromAccount: undefined as AccountItem | undefined,
      toAccount: undefined as AccountItem | undefined,
      date: new Date(),
    },
  });

  // Pre-fill form
  useEffect(() => {
    // Reset to empty for new transfer
    reset({
      amount: '',
      fromAccount: undefined,
      toAccount: undefined,
      date: new Date(), // todays date
    });
  }, [reset]);

  const onFormSubmit = (data: {
    amount: string;
    fromAccount: AccountItem;
    toAccount: AccountItem;
    date: Date;
  }) => {
    onSubmit({
      amount: Number(data.amount),
      fromAccountId: data.fromAccount.id,
      toAccountId: data.toAccount.id,
      date: format(data.date, 'yyyy-MM-dd'),
    });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='grid gap-8'>
      <FieldGroup>
        {/* From account */}
        <Controller
          name='fromAccount'
          control={control}
          rules={{
            validate: (value) => value != null || 'Please select an account.',
          }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>From account</FieldLabel>

              <Select
                onValueChange={(value) => {
                  const selected = accounts.find((acc) => acc.id === value);
                  if (selected) field.onChange(selected);
                }}
                value={field.value?.id ?? ''}
              >
                <SelectTrigger
                  className={`${
                    fieldState.invalid &&
                    'border-destructive focus-visible:ring-destructive'
                  }`}
                >
                  <SelectValue placeholder='Select account' />
                </SelectTrigger>
                <SelectContent align='end' position='popper'>
                  {/* Existing Accounts */}
                  <SelectGroup>
                    <SelectLabel>Accounts</SelectLabel>
                    {accounts.map((acc) => {
                      return (
                        <SelectItem key={acc.id} value={acc.id}>
                          <span>{acc.name}</span>
                          <span className='text-muted-foreground'>
                            ({formatCurrency(acc.balance)})
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error!]} />
              )}
            </Field>
          )}
        />
        {/* To account */}
        <Controller
          name='toAccount'
          control={control}
          rules={{
            validate: (value, formValues) => {
              if (!value) return 'Please select an account.';
              if (
                formValues.fromAccount &&
                value.id === formValues.fromAccount.id
              ) {
                return 'Cannot transfer to the same account.';
              }
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>To account</FieldLabel>

              <Select
                onValueChange={(value) => {
                  const selected = accounts.find((acc) => acc.id === value);
                  if (selected) field.onChange(selected);
                }}
                value={field.value?.id ?? ''}
              >
                <SelectTrigger
                  className={`${
                    fieldState.invalid &&
                    'border-destructive focus-visible:ring-destructive'
                  }`}
                >
                  <SelectValue placeholder='Select account' />
                </SelectTrigger>
                <SelectContent align='end' position='popper'>
                  {/* Existing Accounts */}
                  <SelectGroup>
                    <SelectLabel>Accounts</SelectLabel>
                    {accounts.map((acc) => {
                      return (
                        <SelectItem key={acc.id} value={acc.id}>
                          <span>{acc.name}</span>
                          <span className='text-muted-foreground'>
                            ({formatCurrency(acc.balance)})
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error!]} />
              )}
            </Field>
          )}
        />

        {/* Amount */}
        <Field data-invalid={!!errors.amount}>
          <FieldLabel>Amount</FieldLabel>
          <Input
            {...register('amount', {
              required: 'Amount is required.',
              validate: (value, formValues) => {
                const num = Number(value);
                if (isNaN(num)) return 'Must be a valid number.';
                if (num < 1) return 'Amount must be at least 1.';
                // Insufficient funds check
                const fromAccount = formValues.fromAccount;
                if (fromAccount && num > fromAccount.balance) {
                  return `Insufficient funds. Available: ${
                    fromAccount.name
                  } ${formatCurrency(fromAccount.balance)} `;
                }
                return true;
              },
            })}
            type='number'
            step='0.01'
            placeholder='0'
            className={
              errors.amount
                ? 'border-destructive focus-visible:ring-destructive'
                : ''
            }
          />
          {errors.amount && <FieldError errors={[errors.amount]} />}
        </Field>

        {/* Date */}
        <Controller
          name='date'
          control={control}
          rules={{ required: 'Please select a date.' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Date</FieldLabel>
              <Popover open={calenderOpen} onOpenChange={setCalenderOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    className={`flex items-center justify-between text-left w-full ${
                      fieldState.invalid
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                    }`}
                  >
                    <span>
                      {field.value
                        ? format(field.value, 'yyyy-MM-dd')
                        : 'Pick a date'}
                    </span>
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='start' side='bottom'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error!]} />
              )}
            </Field>
          )}
        />
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
          Transfer
        </Button>
      </DialogFooter>
    </form>
  );
};
