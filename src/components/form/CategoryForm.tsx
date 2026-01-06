import {
  type CategoryBase,
  type CategoryItem,
} from '@/context/categoryContext';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

type TransactionFormProps = {
  category?: CategoryItem; // undefined = new, provided = edit mode
  onSubmit: (data: CategoryBase) => void;
  onCancel: () => void;
};

export const CategoryForm = ({
  category,
  onSubmit,
  onCancel,
}: TransactionFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{
    name: string;
  }>({
    defaultValues: {
      name: '',
    },
  });

  // Sync form with category prop (for create vs edit)
  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
      });
    } else {
      // Reset to empty for new category
      reset({
        name: '',
      });
    }
  }, [category, reset]);

  const onFormSubmit = (data: { name: string }) => {
    onSubmit({
      name: data.name,
    });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='grid gap-8'>
      <FieldGroup>
        {/* Category name */}
        <Field data-invalid={!!errors.name}>
          <FieldLabel>Name</FieldLabel>
          <Input
            {...register('name', {
              required: 'Category name is required.',
              minLength: {
                value: 1,
                message: 'Category name must be at least 1 character.',
              },
              validate: (value) =>
                value.trim().length > 0 || 'Category name cannot be empty.',
            })}
            placeholder='e.g. Housing'
            className={
              errors.name
                ? 'border-destructive focus-visible:ring-destructive'
                : ''
            }
          />
          {errors.name && <FieldError errors={[errors.name]} />}
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
          {category ? 'Update' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  );
};
