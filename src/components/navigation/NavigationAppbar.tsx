import { FormDialog } from '@/components/dialog/FormDialog';
import { TransactionForm } from '@/components/form/TransactionForm';
import {
  useAccount,
  type AccountBase,
  type TransferBase,
} from '@/context/accountContext';
import { useCategory, type CategoryBase } from '@/context/categoryContext';
import { useTheme } from '@/context/themeContext';
import {
  useTransaction,
  type TransactionBase,
} from '@/context/transactionContext';
import { useDialog } from '@/hooks/useDialog';
import { NavMenu } from '@/lib/navMenu';
import {
  ArrowRightLeft,
  CreditCard,
  Menu,
  MoonIcon,
  Receipt,
  Star,
  SunIcon,
  Tags,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { AccountForm } from '../form/AccountForm';
import { CategoryForm } from '../form/CategoryForm';
import { TransferForm } from '../form/TransferForm';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

type DialogMode = 'transaction' | 'category' | 'account' | 'transfer';

/// Navigationbar
// - Top bar /
// - Used for mobile device /
export const NavigationAppbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isDialogOpen, setIsDialogOpen } = useDialog();

  const { addTransaction } = useTransaction();
  const { addCategory } = useCategory();
  const { addAccount, transferMoney } = useAccount();

  const [open, setOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode | undefined>(
    undefined
  );

  const handleCloseAppbar = () => {
    setOpen(false);
  };

  /**Handle dialog */
  const openAddTransaction = () => {
    setDialogMode('transaction');
    setIsDialogOpen(true);
  };
  const openNewCategory = () => {
    setDialogMode('category');
    setIsDialogOpen(true);
  };
  const openAccount = () => {
    setDialogMode('account');
    setIsDialogOpen(true);
  };
  const openTransfer = () => {
    setDialogMode('transfer');
    setIsDialogOpen(true);
  };

  /**Handle transaction, category, account and transfer in Quick actions*/
  const handleAddTransaction = (data: TransactionBase) => {
    const signedAmount = data.type === 'Income' ? data.amount : -data.amount;
    addTransaction({
      description: data.description,
      amount: signedAmount,
      category: data.category,
      type: data.type,
      account: data.account,
      date: data.date,
    });
    toast.success('Transaction has been created');
  };
  const handleNewCategory = (data: CategoryBase) => {
    addCategory(data);
    toast.success('Category has been created');
  };
  const handleAddAccount = (data: AccountBase) => {
    addAccount(data);
    toast.success('Account has been created');
  };
  const handleTransfer = (data: TransferBase) => {
    transferMoney(data);
    toast.success('Transfer has been created');
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
                          isActive && 'navigationButton font-semibold'
                        }`
                      }
                    >
                      <item.icon
                        className={`h-5 w-5 ${isActive ? 'font-bold' : ''}`}
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
                  <Receipt className='h-5 w-5' />
                  <span>New transaction</span>
                </button>
              </div>
              <div className='mt-4 space-y-2'>
                <button
                  onClick={() => openNewCategory()}
                  className='flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-lg hover:bg-accent/50 transition-colors'
                >
                  <Tags className='h-5 w-5' />
                  <span>New category</span>
                </button>
              </div>
              <div className='mt-4 space-y-2'>
                <button
                  onClick={() => openAccount()}
                  className='flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-lg hover:bg-accent/50 transition-colors'
                >
                  <CreditCard className='h-5 w-5' />
                  <span>New account</span>
                </button>
              </div>
              <div className='mt-4 space-y-2'>
                <button
                  onClick={() => openTransfer()}
                  className='flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-lg hover:bg-accent/50 transition-colors'
                >
                  <ArrowRightLeft className='h-5 w-5' />
                  <span>Transfer</span>
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

      {/* Dialogs */}
      {/* Add transaction Dialog */}
      {dialogMode === 'transaction' && (
        <FormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title='New transaction'
          description='Enter the details for your new transaction.'
        >
          <TransactionForm
            onSubmit={handleAddTransaction}
            onCancel={() => setIsDialogOpen(!isDialogOpen)}
          />
        </FormDialog>
      )}
      {/* New category dialog */}
      {dialogMode === 'category' && (
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
      {/* New account dialog */}
      {dialogMode === 'account' && (
        <FormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title='New account'
          description='Enter the name and current balance for your new account.'
        >
          <AccountForm
            onSubmit={handleAddAccount}
            onCancel={() => setIsDialogOpen(false)}
          />
        </FormDialog>
      )}
      {/* Transfer dialog */}
      {dialogMode === 'transfer' && (
        <FormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title='Transfer'
          description='Select accounts, amount and date of your transfer.'
        >
          <TransferForm
            onSubmit={handleTransfer}
            onCancel={() => setIsDialogOpen(false)}
          />
        </FormDialog>
      )}
    </nav>
  );
};
