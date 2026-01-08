/* eslint-disable react-hooks/set-state-in-effect */
import {
  type CategoryBase,
  type CategoryItem,
} from '@/context/categoryContext';
import { iconList, iconMap } from '@/lib/icons';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

type CategoryFormProps = {
  category?: CategoryItem; // undefined = new, provided = edit mode
  onSubmit: (data: CategoryBase) => void;
  onCancel: () => void;
};

/// Form for category
// - Add/Edit category /
export const CategoryForm = ({
  category,
  onSubmit,
  onCancel,
}: CategoryFormProps) => {
  const [selectedIconKey, setSelectedIconKey] = useState<string>(
    category?.iconName ?? 'X' // default to X if creating new
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{
    name: string;
  }>({
    defaultValues: {
      name: category?.name ?? '',
    },
  });

  // Sync form with category changes (for create vs edit)
  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
      });
      setSelectedIconKey(category.iconName);
    } else {
      // Reset to empty for new category
      reset({
        name: '',
      });
      setSelectedIconKey('X');
    }
  }, [category, reset]);

  const onFormSubmit = (data: { name: string }) => {
    onSubmit({
      name: data.name,
      iconName: selectedIconKey,
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
        {/* Icon Picker */}
        <Field>
          <FieldLabel>Icon</FieldLabel>
          <div className='flex flex-wrap gap-1.5'>
            {iconList.map((key) => {
              const Icon = iconMap[key];
              return (
                <Button
                  key={key}
                  variant={'outline'}
                  type='button'
                  size={'icon'}
                  onClick={() => setSelectedIconKey(key)}
                  className={`${
                    selectedIconKey === key &&
                    'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500'
                  }`}
                >
                  <Icon />
                </Button>
              );
            })}
          </div>
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
