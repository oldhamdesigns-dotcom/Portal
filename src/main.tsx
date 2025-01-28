import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/style.css';
import App from '@/App';
import { BrowserRouter, Route, Routes } from 'react-router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <div className={'min-h-screen min-w-full bg-gray'}>
        <Routes>
          <Route
            path={'*'}
            element={<App />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  </StrictMode>
);
