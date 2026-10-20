import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Global styles first so component styles (imported by App) can override them.
import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/animations.css';
import App from '@/App';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element in index.html');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
