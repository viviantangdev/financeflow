import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import './App.css';
import App from './App.tsx';
import { CategoryProvider } from './context/categoryContext.tsx';
import { TransactionProvider } from './context/transactionContext.tsx';
import { ThemeProvider } from './context/themeContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <CategoryProvider>
          <TransactionProvider>
            <App />
          </TransactionProvider>
        </CategoryProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
