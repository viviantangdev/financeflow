import type React from 'react';

export const CardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-white py-3 px-6 rounded-md shadow-sm'>
      {children}
    </div>
  );
};
