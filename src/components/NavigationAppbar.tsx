import { useTheme } from '@/context/themeContext';
import { NavMenu } from '@/lib/navMenu';
import { Menu, MoonIcon, Star, SunIcon } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './ui/navigation-menu';
import { Separator } from './ui/separator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
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

          <NavigationMenu className='block'>
            <NavigationMenuList className='flex flex-col'>
              {NavMenu.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavigationMenuItem asChild key={item.title}>
                    <NavigationMenuLink>
                      <NavLink
                        to={item.href}
                        onClick={handleClose}
                        className={`flex gap-1 items-center ${
                          isActive && 'text-red-300'
                        }`}
                      >
                        <item.icon size={20} />
                        {item.title}
                      </NavLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
              {/* <NavigationMenuLink asChild>Link</NavigationMenuLink> */}
            </NavigationMenuList>
          </NavigationMenu>

          <SheetFooter>
            {' '}
            <button
              onClick={() => {
                toggleTheme();
                handleClose();
              }}
              className='flex gap-1'
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              <span>Switch theme</span>
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
