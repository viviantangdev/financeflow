import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import './App.css';
import App from './App.tsx';
import { AccountProvider } from './context/accountContext.tsx';
import { CategoryProvider } from './context/categoryContext.tsx';
import { ThemeProvider } from './context/themeContext.tsx';
import { TransactionProvider } from './context/transactionContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SidebarProvider>
        <ThemeProvider>
          <AccountProvider>
            <CategoryProvider>
              <TransactionProvider>
                <App />
              </TransactionProvider>
            </CategoryProvider>
          </AccountProvider>
        </ThemeProvider>
        <Toaster />
      </SidebarProvider>
    </BrowserRouter>
  </StrictMode>
);
