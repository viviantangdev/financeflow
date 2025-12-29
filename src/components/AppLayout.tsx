import { NavMenu } from '@/lib/navMenu';
import { Outlet, useLocation } from 'react-router-dom';
import { NavigationSidebar } from './NavigationSidebar';

export const AppLayout = () => {
  const location = useLocation();

  const pageTitle = NavMenu.find(
    (item) => location.pathname === item.href
  )?.title;

  return (
    <div className='flex p-3 w-screen'>
      <NavigationSidebar />
      <div className='flex-1'>
        <header className='pb-3'>
          <h2 className='text-xl'>{pageTitle}</h2>
        </header>
        <main className='flex-1'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
