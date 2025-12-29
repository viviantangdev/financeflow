import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { NavMenu } from '@/lib/navMenu';
import { Star } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { Separator } from './ui/separator';

export const NavigationSidebar = () => {
  const location = useLocation();

  return (
    <nav>
      <Sidebar collapsible='icon' variant='floating'>
        <SidebarHeader>
          <SidebarMenuButton asChild>
            <NavLink to={'/'}>
              <Star />
              <span>FinanceFlow</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarHeader>
        <Separator/>
        <SidebarContent className='p-2'>
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
        </SidebarContent>
        <SidebarFooter>
          <SidebarTrigger variant={'secondary'} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </nav>
  );
};
