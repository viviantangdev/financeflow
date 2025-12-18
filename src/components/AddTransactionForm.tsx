import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCategory, type CategoryItem } from '@/context/categoryContext';
import {
  TRANSACTION_TYPES,
  type TransactionType,
} from '@/context/transactionContext';
import { formatDateToYYYYMMDD } from '@/lib/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
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

type AddTransactionFormProps = {
  onSubmit: (data: {
    description: string;
    amount: string;
    type: TransactionType;
    category: CategoryItem;
    date: Date;
  }) => void;
  onCancel: () => void;
};

const AddTransactionForm = ({
  onSubmit,
  onCancel,
}: AddTransactionFormProps) => {
  const [calenderOpen, setCalenderOpen] = useState(false);
  const { categories } = useCategory();
  const formSchema = z.object({
    description: z.string().min(1, 'Description must be at least 1 character.'),
    type: z.enum(TRANSACTION_TYPES as [TransactionType, ...TransactionType[]], {
      error: 'Please select a type.',
    }),
    amount: z
      .string()
      .min(1, { message: 'Amount is required' })
      .transform((val) => Number(val))
      .pipe(z.number().min(1, { message: 'Amount must be at least 1' })),
    category: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .refine((obj) => categories.some((c) => c.id === obj.id), {
        message: 'Please select a category.',
      }),
    date: z.date({ error: 'Please select a date.' }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      amount: '',
      type: undefined,
      category: {},
      date: new Date(), // today by default
    },
  });

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({
      description: data.description,
      amount: data.amount.toString(),
      type: data.type,
      category: data.category,
      date: data.date,
    });
  };
  const { handleSubmit, control, formState } = form;

  return (
    <DialogContent className='sm:max-w-106'>
      <DialogHeader>
        <DialogTitle className='uppercase'>Add transaction</DialogTitle>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className='grid gap-4 pt-5'
      >
        <FieldGroup>
          {/* Type */}
          <Controller
            name='type'
            control={control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                {/* <FieldLegend>Type</FieldLegend> */}
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
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
                        <RadioGroupItem
                          value={t}
                          id={t}
                          aria-invalid={fieldState.invalid}
                        />
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />

          {/* Description */}
          <Controller
            name='description'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Description</FieldLabel>
                <Input
                  {...field}
                  placeholder='e.g. Grocery shopping'
                  className={`${
                    fieldState.invalid &&
                    'border-destructive focus-visible:ring-destructive'
                  } `}
                />
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : []}
                />
              </Field>
            )}
          />

          {/* Amount */}
          <Controller
            name='amount'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Amount</FieldLabel>
                <Input
                  {...field}
                  type='number'
                  placeholder='0'
                  className={`${
                    fieldState.invalid &&
                    'border-destructive focus-visible:ring-destructive'
                  } `}
                />
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : []}
                />
              </Field>
            )}
          />

          {/* Category */}
          <Controller
            name='category'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Category</FieldLabel>
                <Select
                  onValueChange={(value) => {
                    const selected = categories.find((c) => c.id === value);
                    if (selected) field.onChange(selected);
                  }}
                  value={field.value?.id}
                >
                  <SelectTrigger
                    className={`${
                      fieldState.invalid &&
                      'border-destructive focus-visible:ring-destructive'
                    } `}
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
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : []}
                />
              </Field>
            )}
          />

          {/* Date */}
          <Controller
            name='date'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Date</FieldLabel>
                <Popover open={calenderOpen} onOpenChange={setCalenderOpen}>
                  <PopoverTrigger asChild className='hover:bg-transparent'>
                    <Button
                      type='button'
                      variant={'outline'}
                      className={`flex items-center justify-between text-left w-full ${
                        fieldState.invalid &&
                        'border-destructive focus-visible:ring-destructive'
                      } `}
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
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : []}
                />
              </Field>
            )}
          />
        </FieldGroup>
        <FieldSeparator />

        <DialogFooter className='pt-0'>
          <DialogClose asChild>
            <Button type='button' variant={'outline'} onClick={onCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type='submit'
            variant={'default'}
            disabled={formState.isSubmitting}
          >
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default AddTransactionForm;
