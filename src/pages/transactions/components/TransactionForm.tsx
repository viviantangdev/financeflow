import { useCategory, type CategoryItem } from '@/context/categoryContext';
import {
  TRANSACTION_TYPES,
  type TransactionBase,
  type TransactionItem,
  type TransactionType,
} from '@/context/transactionContext';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronDownIcon, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/button';
import { Calendar } from '../../../components/ui/calendar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../components/ui/collapsible';
import { DialogFooter } from '../../../components/ui/dialog';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from '../../../components/ui/field';
import { Input } from '../../../components/ui/input';
import { PopoverContent } from '../../../components/ui/popover';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Separator } from '../../../components/ui/separator';

type TransactionFormProps = {
  transaction?: TransactionItem; // undefined = new, provided = edit mode
  onSubmit: (data: TransactionBase) => void;
  onCancel: () => void;
};

export const TransactionForm = ({
  transaction,
  onSubmit,
  onCancel,
}: TransactionFormProps) => {
  const [calenderOpen, setCalenderOpen] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const { categories, addCategory } = useCategory();
  const [newCategory, setNewCategory] = useState('');

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
        date: new Date(), // todays date
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
      date: format(data.date, 'yyyy-MM-dd'),
    });
    onCancel();
  };

  const toggleShowAddCategory = () => {
    setShowAddCategory(!showAddCategory);
  };

  const handleAddCategory = () => {
    addCategory({ name: newCategory });
    toggleShowAddCategory();
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
                className={`flex flex-row  ${
                  fieldState.invalid &&
                  'border-destructive border rounded-md p-2'
                }`}
              >
                {TRANSACTION_TYPES.map((t) => (
                  <FieldLabel key={t} htmlFor={t} className='cursor-pointer'>
                    <Field
                      orientation='horizontal'
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <FieldTitle>{t}</FieldTitle>
                      </FieldContent>
                      <RadioGroupItem value={t} id={t} className='radioItem' />
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
                  className={`${
                    fieldState.invalid &&
                    'border-destructive focus-visible:ring-destructive'
                  }`}
                >
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>
                <SelectContent align='end' position='popper'>
                  <Collapsible
                    open={showAddCategory}
                    onOpenChange={toggleShowAddCategory}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='w-full flex justify-between p-2'
                      >
                        <div className='flex items-center gap-1'>
                          <Plus />
                          <span>Create category</span>
                        </div>
                        <motion.div
                          animate={{ rotate: showAddCategory ? 180 : 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          style={{ originY: 'center', originX: 'center' }}
                        >
                          <ChevronDown className='h-4 w-4 opacity-50' />
                        </motion.div>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent forceMount>
                      <AnimatePresence initial={false}>
                        {showAddCategory && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              height: { duration: 0.25, ease: 'easeInOut' },
                              opacity: { duration: 0.2 },
                            }}
                            className='overflow-hidden'
                          >
                            <div className='space-y-3 p-5'>
                              <Input
                                placeholder='New category name'
                                autoFocus
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Escape') {
                                    setShowAddCategory(false);
                                  }
                                }}
                              />
                              <div className='flex gap-2'>
                                <Button size='sm' onClick={handleAddCategory}>
                                  Create
                                </Button>
                                <Button
                                  size='sm'
                                  variant='outline'
                                  onClick={() => setShowAddCategory(false)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
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
                        ? format(field.value, 'yyyy-MM-dd')
                        : 'Pick a date'}
                    </span>
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='end' side='bottom'>
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
          {transaction ? 'Update' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  );
};
