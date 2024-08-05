import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { StatusProvider } from './context/responsecontext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StatusProvider>
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
</StatusProvider>
);
