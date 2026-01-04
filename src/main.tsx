import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { SidebarProvider } from '@/components/ui/sidebar';
import './App.css';
import App from './App.tsx';
import { CategoryProvider } from './context/categoryContext.tsx';
import { ThemeProvider } from './context/themeContext.tsx';
import { TransactionProvider } from './context/transactionContext.tsx';
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SidebarProvider>
        <ThemeProvider>
          <CategoryProvider>
            <TransactionProvider>
              <App />
            </TransactionProvider>
          </CategoryProvider>
        </ThemeProvider>
        <Toaster/>
      </SidebarProvider>
    </BrowserRouter>
  </StrictMode>
);
