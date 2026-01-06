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
import { useTheme } from '@/context/themeContext';
import {
  useTransaction,
  type TransactionBase,
} from '@/context/transactionContext';
import { useDialog } from '@/hooks/useDialog';
import { NavMenu } from '@/lib/navMenu';
import { MoonIcon, Plus, Star, SunIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { toast } from 'sonner';
import { TransactionDialog } from '@/pages/transactions/components/TransactionDialog';
import { TransactionForm } from '@/pages/transactions/components/TransactionForm';

export const NavigationSidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isDialogOpen, setIsDialogOpen } = useDialog();

  const { addTransaction } = useTransaction();

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
    <Sidebar collapsible='icon' variant='floating'>
      <SidebarHeader>
        <SidebarMenuButton asChild>
          <NavLink to='/'>
            <Star className='h-5 w-5' />
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
                        className={`flex items-center gap-3 w-full ${
                          isActive && 'bg-accent font-semibold'
                        }`}
                      >
                        <item.icon
                          className={`${isActive && 'text-emerald-500'}`}
                        />
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
                <SidebarMenuButton asChild tooltip='Add transaction'>
                  <button
                    onClick={() => setIsDialogOpen(!isDialogOpen)}
                    className='flex w-full items-center gap-3'
                  >
                    <Plus className='h-4 w-4' />
                    <span>Add transaction</span>
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
    </Sidebar>
  );
};
