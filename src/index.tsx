import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { applyTheme, watchSystemTheme } from './lib/theme';
import { initNative } from './lib/native';

applyTheme();
watchSystemTheme();
initNative();

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
