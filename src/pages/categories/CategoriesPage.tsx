import { ActionButton } from '@/components/button/ActionButton';
import { FormDialog } from '@/components/dialog/FormDialog';
import { CategoryForm } from '@/components/form/CategoryForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useCategory,
  type CategoryBase,
  type CategoryItem,
} from '@/context/categoryContext';
import { useDialog } from '@/hooks/useDialog';
import { iconMap } from '@/lib/icons';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type DialogMode = 'add' | 'edit' | 'delete';

export const CategoriesPage = () => {
  const { categories, addCategory, updateCategory, deleteCategory } =
    useCategory();
  const { isDialogOpen, setIsDialogOpen } = useDialog();

  const [dialogMode, setDialogMode] = useState<DialogMode>('add');
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(
    null
  );

  const openAdd = () => {
    setDialogMode('add');
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const openEdit = (category: CategoryItem) => {
    setDialogMode('edit');
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const openDelete = (category: CategoryItem) => {
    setDialogMode('delete');
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleAdd = (data: CategoryBase) => {
    addCategory({ name: data.name, iconName: data.iconName });
    toast.success('Category has been created');
  };
  const handleEdit = (data: CategoryBase) => {
    updateCategory(selectedCategory!.id, {
      name: data.name,
      iconName: data.iconName,
    });
    toast.success('Category has been updated');
  };
  const handleDelete = (data: CategoryItem) => {
    deleteCategory(data.id);
    toast.success('Category has been deleted');
  };

  return (
    <div className='flex flex-col gap-5'>
      <section>
        <ActionButton text='New category' onClick={() => openAdd()} />
      </section>
      <section className='space-y-3'>
        {categories.map((item) => {
          const Icon = iconMap[item.iconName];
          return (
            <Card key={item.id}>
              <CardHeader className='flex justify-between items-center flex-wrap gap-5'>
                <CardTitle className='flex items-center flex-wrap gap-3'>
                  <div className='iconBadge'>
                    <Icon />
                  </div>

                  <span>{item.name}</span>
                </CardTitle>
                <CardAction className='space-x-2'>
                  <Button
                    variant={'outline'}
                    size={'icon'}
                    onClick={() => openEdit(item)}
                    className='text-emerald-500'
                  >
                    <Edit2 />
                  </Button>
                  <Button
                    variant={'outline'}
                    size={'icon'}
                    onClick={() => openDelete(item)}
                    className='text-red-500'
                  >
                    <Trash2 />
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
          );
        })}
      </section>

      {/* New category dialog */}
      {dialogMode === 'add' && (
        <FormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title='New category'
          description='Enter the name and select an icon for your new category.'
        >
          <CategoryForm
            onSubmit={handleAdd}
            onCancel={() => setIsDialogOpen(false)}
          />
        </FormDialog>
      )}
      {/* Edit category Dialog */}
      {dialogMode === 'edit' && (
        <FormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title='Edit category'
          description='Update the name of this category.'
        >
          <CategoryForm
            category={selectedCategory!}
            onSubmit={handleEdit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </FormDialog>
      )}
      {/* Delete category AlertDialog */}
      {dialogMode === 'delete' && (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className='flex items-center gap-2'>
                  <Trash2 className='h-4 w-4' />
                  <p> Are you absolutely sure?</p>
                </div>
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div className='space-y-3'>
                  <p>
                    You´re about to delete category: {selectedCategory?.name}
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(selectedCategory!)}
                className='errorButton'
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
