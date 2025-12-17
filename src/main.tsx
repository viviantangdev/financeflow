import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';

import './App.css'
import App from './App.tsx'
import { FinanceProvider } from './context/financeContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FinanceProvider>
        <App />
      </FinanceProvider>
    </BrowserRouter>
  </StrictMode>,
)
