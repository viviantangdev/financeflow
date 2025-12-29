import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useTheme } from '@/context/themeContext';
import { NavMenu } from '@/lib/navMenu';
import { MoonIcon, Star, SunIcon } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

export const NavigationSidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav>
      <Sidebar collapsible='icon' variant='floating'  >
        <SidebarHeader>
          <SidebarMenuButton asChild>
            <NavLink to={'/'}>
              <Star />
              <span>FinanceFlow</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarSeparator className='mx-auto' />
        <SidebarContent className='p-2'>
          {/* Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {NavMenu.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.href}
                        className={`${isActive && 'text-red-400'}`}
                      >
                        <item.icon />
                        {item.title}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
          {/* Settings */}
          <SidebarGroup className='mt-auto'>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={'Switch theme'}>
                  <button type='button' onClick={toggleTheme}>
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    <span>Switch theme</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator className='mx-auto' />

        <SidebarFooter>
          <SidebarTrigger variant={'secondary'} />
        </SidebarFooter>
      </Sidebar>
    </nav>
  );
};
