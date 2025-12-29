import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const NotFound = () => {
  return (
    <section className='flex flex-col items-center gap-5'>
      <AlertCircle size={50} />
      <div className='flex flex-col items-center'>
        <h2 className='text-4xl tracking-wider'>404 - error</h2>
        <p className='uppercase text-xl'>Page not found</p>
      </div>
      <NavLink to={'/'}>
        <Button>Back to home</Button>
      </NavLink>
    </section>
  );
};
