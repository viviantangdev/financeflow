import { useTheme } from '@/context/themeContext';
import { NavMenu } from '@/lib/navMenu';
import { Menu, MoonIcon, Plus, Star, SunIcon } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { TransactionDialog } from './TransactionDialog';
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

  const handleClose = () => {
    setOpen(false);
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
                      onClick={handleClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-md px-3 py-2.5 text-lg transition-colors ${
                          isActive
                            ? 'bg-accent font-semibold text-accent-foreground'
                            : 'hover:bg-accent/50'
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
                <TransactionDialog
                  trigger={
                    <button className='flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-lg hover:bg-accent/50 transition-colors'>
                      <Plus className='h-5 w-5' />
                      <span>Create transaction</span>
                    </button>
                  }
                />
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
    </nav>
  );
};
