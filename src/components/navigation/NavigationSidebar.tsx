import { FormDialog } from '@/components/dialog/FormDialog';
import { TransactionForm } from '@/components/form/TransactionForm';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
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
  MoonIcon,
  Receipt,
  Star,
  SunIcon,
  Tags,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'sonner';
import { AccountForm } from '../form/AccountForm';
import { CategoryForm } from '../form/CategoryForm';
import { TransferForm } from '../form/TransferForm';

type DialogMode = 'transaction' | 'category' | 'account' | 'transfer';

/// Navigationbar
// - Side bar /
// - Used for tablet and desktop device /
export const NavigationSidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isDialogOpen, setIsDialogOpen } = useDialog();

  const { addTransaction } = useTransaction();
  const { addCategory } = useCategory();
  const { addAccount, transferMoney } = useAccount();

  const [dialogMode, setDialogMode] = useState<DialogMode | undefined>(
    undefined
  );

  /**Handle dialog */
  const openTransaction = () => {
    setDialogMode('transaction');
    setIsDialogOpen(true);
  };
  const openCategory = () => {
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
    <Sidebar collapsible='icon' variant='floating'>
      <SidebarHeader>
        <SidebarMenuButton asChild>
          <NavLink to='/'>
            <Star />
            <span>FinanceFlow</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarSeparator className='mx-auto' />

      <SidebarContent className='px-2 py-6 space-y-6'>
        {/* Navigation Group */}
        <SidebarGroup>
          <SidebarGroupLabel className='group-data-[collapsible=icon]:pointer-events-none'>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NavMenu.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.href}
                        end
                        className={`flex items-center gap-3 w-full my-0.5 ${
                          isActive && 'navigationButton font-semibold'
                        }`}
                      >
                        <item.icon className={`${isActive && 'font-bold'}`} />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions Group */}
        <SidebarGroup>
          <SidebarGroupLabel className='group-data-[collapsible=icon]:pointer-events-none'>
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip='New transaction'>
                  <button
                    onClick={() => openTransaction()}
                    className='flex w-full items-center gap-3'
                  >
                    <Receipt className='h-4 w-4' />
                    <span>New transaction</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip='New category'>
                  <button
                    onClick={() => openCategory()}
                    className='flex w-full items-center gap-3'
                  >
                    <Tags className='h-4 w-4' />
                    <span>New category</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip='New account'>
                  <button
                    onClick={() => openAccount()}
                    className='flex w-full items-center gap-3'
                  >
                    <CreditCard className='h-4 w-4' />
                    <span>New account</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip='Transfer'>
                  <button
                    onClick={() => openTransfer()}
                    className='flex w-full items-center gap-3'
                  >
                    <ArrowRightLeft className='h-4 w-4' />
                    <span>Transfer</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Group */}
        <SidebarGroup>
          <SidebarGroupLabel className='group-data-[collapsible=icon]:pointer-events-none'>
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip='Switch theme'>
                  <button
                    onClick={toggleTheme}
                    className='flex w-full items-center gap-3'
                  >
                    {theme === 'dark' ? (
                      <SunIcon className='h-4 w-4' />
                    ) : (
                      <MoonIcon className='h-4 w-4' />
                    )}
                    <span>Theme</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className='mx-auto' />

      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>

      {/**Dialogs */}
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
    </Sidebar>
  );
};
