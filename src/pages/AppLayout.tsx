import { NavigationAppbar } from '@/components/navigation/NavigationAppbar';
import { NavMenu } from '@/lib/navMenu';
import { Outlet, useLocation } from 'react-router-dom';
import { NavigationSidebar } from '../components/navigation/NavigationSidebar';

export const AppLayout = () => {
  const location = useLocation();

  const currentItem = NavMenu.find(
    (item) =>
      location.pathname === item.href ||
      (item.isIndex && location.pathname === '/')
  );

  const pageTitle = currentItem?.title || 'Dashboard';
  const PageIcon = currentItem!.icon;

  return (
    <div className=' w-screen md:flex'>
      <NavigationSidebar />
      <NavigationAppbar />
      <div className='md:flex-1 overflow-auto my-2 rounded-lg px-3 py-6 flex flex-col gap-8'>
        <header className='flex items-center gap-2'>
          <PageIcon />
          <h2 className='text-2xl'>{pageTitle}</h2>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
