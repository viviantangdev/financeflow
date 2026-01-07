import { useCategory, type CategoryItem } from '@/context/categoryContext';
import {
  TRANSACTION_TYPES,
  type TransactionBase,
  type TransactionItem,
  type TransactionType,
} from '@/context/transactionContext';
import { iconList, iconMap } from '@/lib/icons';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { ChevronDown, ChevronDownIcon, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { DialogFooter } from '../ui/dialog';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from '../ui/field';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { PopoverContent } from '../ui/popover';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';

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
  const [newCategoryIconKey, setNewCategoryIconKey] = useState<string>('X'); // default icon

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

  const handleAddCategory = () => {
    addCategory({ name: newCategory, iconName: newCategoryIconKey });
    resetAddCategory();
  };

  const resetAddCategory = () => {
    setShowAddCategory(false);
    setNewCategory('');
    setNewCategoryIconKey('X');
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
              value != null || 'Please select or create a category.',
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
                  {/* Create New Category Section */}
                  <Collapsible
                    open={showAddCategory}
                    onOpenChange={setShowAddCategory}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant='ghost'
                        type='button'
                        className='w-full flex justify-between p-2'
                      >
                        <div className='flex items-center gap-1'>
                          <Plus />
                          <span>Create category</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 opacity-50 transition-transform duration-200 ${
                            showAddCategory ? 'rotate-180' : ''
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className='space-y-3 p-5'>
                        {/* New Category Name */}

                        <Label>Category name</Label>
                        <Input
                          placeholder='New category name'
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === 'Escape' && resetAddCategory()
                          }
                        />

                        {/* Icon Picker for New Category */}
                        <div className='space-y-3'>
                          <Label>Select icon</Label>

                          <div className='grid grid-cols-6 gap-2'>
                            {iconList.map((key) => {
                              const Icon = iconMap[key];
                              return (
                                <button
                                  key={key}
                                  type='button'
                                  onClick={() => setNewCategoryIconKey(key)}
                                  className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center ${
                                    newCategoryIconKey === key &&
                                    'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                                  }`}
                                >
                                  <Icon className='w-5 h-5' />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex gap-2 mt-6'>
                          <Button
                            size='sm'
                            onClick={handleAddCategory}
                            disabled={!newCategory}
                          >
                            Create
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={resetAddCategory}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />
                  {/* Existing Categories */}
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories.map((c) => {
                      const Icon = iconMap[c.iconName] ?? iconMap.X;
                      return (
                        <SelectItem key={c.id} value={c.id}>
                          <div className='flex items-center gap-2'>
                            <Icon className='w-4 h-4' />
                            <span>{c.name}</span>
                          </div>
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
