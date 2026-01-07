import { FormDialog } from '@/components/dialog/FormDialog';
import { TransactionForm } from '@/components/form/TransactionForm';
import { useCategory, type CategoryBase } from '@/context/categoryContext';
import { useTheme } from '@/context/themeContext';
import {
  useTransaction,
  type TransactionBase,
} from '@/context/transactionContext';
import { useDialog } from '@/hooks/useDialog';
import { NavMenu } from '@/lib/navMenu';
import { Menu, MoonIcon, Plus, Star, SunIcon, Tag } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { CategoryForm } from '../form/CategoryForm';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

type DialogMode = 'addTransaction' | 'newCategory';

export const NavigationAppbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isDialogOpen, setIsDialogOpen } = useDialog();
  const [dialogMode, setDialogMode] = useState<DialogMode>('addTransaction');

  const { addTransaction } = useTransaction();
  const { addCategory } = useCategory();

  const handleCloseAppbar = () => {
    setOpen(false);
  };

  const openAddTransaction = () => {
    setDialogMode('addTransaction');
    setIsDialogOpen(true);
  };
  const openNewCategory = () => {
    setDialogMode('newCategory');
    setIsDialogOpen(true);
  };

  const handleAddTransaction = (data: TransactionBase) => {
    const signedAmount = data.type === 'Income' ? data.amount : -data.amount;
    addTransaction({
      description: data.description,
      amount: signedAmount,
      category: data.category,
      type: data.type,
      date: data.date,
    });
    toast.success('Transaction has been created');
  };
  const handleNewCategory = (data: CategoryBase) => {
    addCategory({ name: data.name, iconName: data.iconName });
    toast.success('Category has been created');
  };

  return (
    <nav className='md:hidden flex justify-between p-3'>
      <Link to={'/'}>
        <div className='flex gap-1'>
          <Star />
          <span>FinanceFlow</span>
        </div>
      </Link>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>FinanceFlow</SheetTitle>
          </SheetHeader>
          <Separator />
          <section className='p-3 space-y-6'>
            {/* Navigation Section */}
            <div>
              <Label className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                Navigation
              </Label>
              <div className='mt-4 space-y-2'>
                {NavMenu.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      key={item.title}
                      to={item.href}
                      end
                      onClick={handleCloseAppbar}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-md px-3 py-2.5 text-lg transition-colors ${
                          isActive && 'bg-accent font-semibold'
                        }`
                      }
                    >
                      <item.icon
                        className={`h-5 w-5 ${
                          isActive ? 'text-emerald-500' : ''
                        }`}
                      />
                      <span>{item.title}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
            {/* Quick Actions Section */}
            <div>
              <Label className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                Quick Actions
              </Label>
              <div className='mt-4 space-y-2'>
                <button
                  onClick={() => openAddTransaction()}
                  className='flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-lg hover:bg-accent/50 transition-colors'
                >
                  <Plus className='h-5 w-5' />
                  <span>Add transaction</span>
                </button>
              </div>
              <div className='mt-4 space-y-2'>
                <button
                  onClick={() => openNewCategory()}
                  className='flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-lg hover:bg-accent/50 transition-colors'
                >
                  <Tag className='h-5 w-5' />
                  <span>New category</span>
                </button>
              </div>
            </div>
            {/* Settings Section */}
            <div>
              <Label className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                Settings
              </Label>
              <div className='mt-4 space-y-2'>
                <button
                  onClick={() => {
                    toggleTheme();
                  }}
                  className='flex gap-3 px-3 py-2.5'
                >
                  {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                  <span>Switch theme</span>
                </button>
              </div>
            </div>
          </section>
        </SheetContent>
      </Sheet>

      {/* Add transaction Dialog */}
      {dialogMode === 'addTransaction' && (
        <FormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title='Add transaction'
          description='Enter the details for your new transaction.'
        >
          <TransactionForm
            onSubmit={handleAddTransaction}
            onCancel={() => setIsDialogOpen(!isDialogOpen)}
          />
        </FormDialog>
      )}
      {/* New category dialog */}
      {dialogMode === 'newCategory' && (
        <FormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title='New category'
          description='Enter the name for your new category.'
        >
          <CategoryForm
            onSubmit={handleNewCategory}
            onCancel={() => setIsDialogOpen(!isDialogOpen)}
          />
        </FormDialog>
      )}
    </nav>
  );
};
