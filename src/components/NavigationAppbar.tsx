import { useTheme } from '@/context/themeContext';
import {
  useTransaction,
  type TransactionBase,
} from '@/context/transactionContext';
import { useDialog } from '@/hooks/useDialog';
import { NavMenu } from '@/lib/navMenu';
import { TransactionDialog } from '@/pages/transactions/components/TransactionDialog';
import { TransactionForm } from '@/pages/transactions/components/TransactionForm';
import { Menu, MoonIcon, Plus, Star, SunIcon } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

export const NavigationAppbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isDialogOpen, setIsDialogOpen } = useDialog();

  const { addTransaction } = useTransaction();

  const handleCloseAppbar = () => {
    setOpen(false);
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

  return (
    <nav className='md:hidden flex justify-between p-3'>
      <div className='flex'>
        <Star />
        <span>FinanceFlow</span>
      </div>
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
                  onClick={() => setIsDialogOpen(!isDialogOpen)}
                  className='flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-lg hover:bg-accent/50 transition-colors'
                >
                  <Plus className='h-5 w-5' />
                  <span>Add transaction</span>
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
      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title='Add transaction'
        description='Enter the details for your new transaction.'
      >
        <TransactionForm
          onSubmit={handleAddTransaction}
          onCancel={() => setIsDialogOpen(!isDialogOpen)}
        />
      </TransactionDialog>
    </nav>
  );
};
