import { NavMenu } from '@/lib/navMenu';
import { Outlet, useLocation } from 'react-router-dom';
import { NavigationSidebar } from '../components/NavigationSidebar';
import { NavigationAppbar } from '@/components/NavigationAppbar';

export const AppLayout = () => {
  const location = useLocation();

  const pageTitle = NavMenu.find(
    (item) => location.pathname === item.href
  )?.title;

  return (
    <div className='md:flex w-screen'>
      <NavigationSidebar />
      <NavigationAppbar/>
      <div className='flex-1 my-2 rounded-lg px-3 py-6 md:border'>
        <header className='pb-3'>
          <h2 className='text-2xl'>{pageTitle}</h2>
        </header>
        <main className='flex-1'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
