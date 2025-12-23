import { useCategory, type CategoryItem } from '@/context/categoryContext';
import {
  TRANSACTION_TYPES,
  type TransactionBase,
  type TransactionItem,
  type TransactionType,
} from '@/context/transactionContext';
import { formatDateToYYYYMMDD } from '@/lib/helpers';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from './ui/field';
import { Input } from './ui/input';
import { PopoverContent } from './ui/popover';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type TransactionFormProps = {
  transaction?: TransactionItem; // undefined = new, provided = edit mode
  onSubmit: (data: TransactionBase) => void;
  onCancel: () => void;
};

const TransactionForm = ({
  transaction,
  onSubmit,
  onCancel,
}: TransactionFormProps) => {
  const [calenderOpen, setCalenderOpen] = useState(false);
  const { categories } = useCategory();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{
    description: string;
    amount: string;
    type: TransactionType;
    category: CategoryItem;
    date: Date;
  }>({
    defaultValues: {
      description: '',
      amount: '',
      type: undefined as TransactionType | undefined,
      category: undefined as CategoryItem | undefined,
      date: new Date(),
    },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (transaction) {
      reset({
        description: transaction.description,
        amount: Math.abs(transaction.amount).toString(),
        type: transaction.type,
        category: transaction.category,
        date: new Date(transaction.date), // convert "YYYY-MM-DD" → Date
      });
    } else {
      // Reset to empty for new transaction
      reset({
        description: '',
        amount: '',
        type: undefined,
        category: undefined,
        date: new Date(),
      });
    }
  }, [transaction, reset]);

  const onFormSubmit = (data: {
    description: string;
    amount: string;
    type: TransactionType;
    category: CategoryItem;
    date: Date;
  }) => {
    onSubmit({
      description: data.description,
      amount: Number(data.amount),
      category: data.category,
      type: data.type,
      date: formatDateToYYYYMMDD(data.date),
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='grid gap-8'>
      <FieldGroup>
        {/* Type */}
        <Controller
          name='type'
          control={control}
          rules={{ required: 'Please select a type.' }}
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error!]} />
              )}
              <RadioGroup
                value={field.value ?? ''}
                onValueChange={field.onChange}
                orientation='horizontal'
                className={`flex flex-row ${
                  fieldState.invalid &&
                  'border-destructive border rounded-md p-2'
                }`}
              >
                {TRANSACTION_TYPES.map((t) => (
                  <FieldLabel key={t} htmlFor={t}>
                    <Field
                      orientation='horizontal'
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <FieldTitle>{t}</FieldTitle>
                      </FieldContent>
                      <RadioGroupItem value={t} id={t} />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
            </FieldSet>
          )}
        />

        {/* Description */}
        <Field data-invalid={!!errors.description}>
          <FieldLabel>Description</FieldLabel>
          <Input
            {...register('description', {
              required: 'Description must be at least 1 character.',
              minLength: {
                value: 1,
                message: 'Description must be at least 1 character.',
              },
            })}
            placeholder='e.g. Grocery shopping'
            className={
              errors.description
                ? 'border-destructive focus-visible:ring-destructive'
                : ''
            }
          />
          {errors.description && <FieldError errors={[errors.description]} />}
        </Field>

        {/* Amount */}
        <Field data-invalid={!!errors.amount}>
          <FieldLabel>Amount</FieldLabel>
          <Input
            {...register('amount', {
              required: 'Amount is required',
              validate: (value) => {
                const num = Number(value);
                return (!isNaN(num) && num >= 1) || 'Amount must be at least 1';
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

        {/* Category */}
        <Controller
          name='category'
          control={control}
          rules={{
            validate: (value) =>
              value && categories.some((c) => c.id === value.id)
                ? true
                : 'Please select a category.',
          }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Category</FieldLabel>
              <Select
                onValueChange={(value) => {
                  const selected = categories.find((c) => c.id === value);
                  if (selected) field.onChange(selected);
                }}
                value={field.value?.id ?? ''}
              >
                <SelectTrigger
                  className={
                    fieldState.invalid
                      ? 'border-destructive focus-visible:ring-destructive'
                      : ''
                  }
                >
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>
                <SelectContent position='popper'>
                  <SelectGroup>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error!]} />
              )}
            </Field>
          )}
        />

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
                        ? formatDateToYYYYMMDD(field.value)
                        : 'Pick a date'}
                    </span>
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
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

      <div className='grid gap-2'>
        <Button
          type='submit'
          variant='default'
          disabled={isSubmitting}
          className='w-full'
        >
          Save
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          className='w-full'
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
