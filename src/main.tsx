import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safety guard against browser extension injection failures (MetaMask / Web3 in sandboxed iframes)
if (typeof window !== 'undefined') {
  const isMetaMaskError = (str: string) => {
    const s = str.toLowerCase();
    return (
      s.includes('metamask') ||
      s.includes('failed to connect') ||
      s.includes('inpage.js') ||
      s.includes('chrome.runtime') ||
      s.includes('user rejected')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = String(event.reason?.message || event.reason?.stack || event.reason || '');
    if (isMetaMaskError(reasonStr)) {
      event.preventDefault();
      if (typeof event.stopImmediatePropagation === 'function') {
        event.stopImmediatePropagation();
      }
      console.warn('[App Entry] Handled unhandled extension rejection:', reasonStr);
    }
  }, true);

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    const file = event.filename || '';
    const errStr = event.error ? (event.error.message || String(event.error)) : '';
    const combined = `${msg} ${file} ${errStr}`;
    if (isMetaMaskError(combined)) {
      event.preventDefault();
      if (typeof event.stopImmediatePropagation === 'function') {
        event.stopImmediatePropagation();
      }
      console.warn('[App Entry] Handled injected wallet script error:', combined);
    }
  }, true);

  // Hook window.ethereum error event directly if available
  const attachEthHandler = () => {
    try {
      const eth = (window as any).ethereum;
      if (eth && typeof eth.on === 'function' && !eth.__pakt_main_handled) {
        eth.__pakt_main_handled = true;
        eth.on('error', (err: any) => {
          console.warn('[App Entry] Handled window.ethereum error event:', err?.message || err);
        });
      }
    } catch {
      // Safe noop
    }
  };

  attachEthHandler();
  window.addEventListener('ethereum#initialized', attachEthHandler, { once: true });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

