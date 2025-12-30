import { NavigationAppbar } from '@/components/NavigationAppbar';
import { NavMenu } from '@/lib/navMenu';
import { Outlet, useLocation } from 'react-router-dom';
import { NavigationSidebar } from '../components/NavigationSidebar';

export const AppLayout = () => {
  const location = useLocation();

  const currentItem = NavMenu.find(
    (item) =>
      location.pathname === item.href ||
      (item.isIndex && location.pathname === '/')
  );

  const pageTitle = currentItem?.title || 'Dashboard';
  const PageIcon = currentItem!.icon; // Capitalized for clarity

  return (
    <div className='md:flex w-screen'>
      <NavigationSidebar />
      <NavigationAppbar />
      <div className='flex-1 my-2 rounded-lg px-3 py-6  flex flex-col gap-8'>
        <header className='flex items-center gap-2'>
          <PageIcon />
          <h2 className='text-2xl'>{pageTitle}</h2>
        </header>
        <main className='flex-1'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
