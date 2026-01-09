
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PWAInstaller } from './components/ui/PWAInstaller';

/**
 * PWA Service Worker Orchestration
 * Registers the federated cache manager for offline platform access.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Service Workers require a secure context (HTTPS or localhost).
    const isSecureContext = window.location.protocol === 'https:' || 
                             window.location.hostname === 'localhost' || 
                             window.location.hostname === '127.0.0.1';

    if (!isSecureContext) {
      console.warn('[FFAI] Service Worker registration skipped: non-secure context.');
      return;
    }

    try {
      /**
       * In sandboxed environments (like AI Studio), the base URL of the document 
       * might be set to the editor origin (ai.studio), while the app runs on 
       * a sub-domain (usercontent.goog). 
       * 
       * To prevent origin mismatch errors, we explicitly resolve 'sw.js' 
       * relative to the window's current origin and path.
       */
      const resolveSwPath = () => {
        try {
          // Attempt to use the URL constructor if available and stable
          const url = new URL('sw.js', window.location.href);
          return url.href;
        } catch (e) {
          // Fallback to manual resolution if URL construction fails
          const origin = window.location.origin;
          const path = window.location.pathname;
          const dir = path.substring(0, path.lastIndexOf('/')) || '';
          return `${origin}${dir.endsWith('/') ? dir : dir + '/'}sw.js`;
        }
      };

      const swPath = resolveSwPath();

      navigator.serviceWorker.register(swPath).then((registration) => {
        console.log('[FFAI] Cache Layer Initialized:', registration.scope);
        
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('[FFAI] New version available. Refresh to synchronize.');
                } else {
                  console.log('[FFAI] Content cached for offline use.');
                }
              }
            };
          }
        };
      }).catch((error) => {
        // Log as a warning to avoid breaking the app in restricted environments
        console.warn('[FFAI] Service Worker registration failed:', error.message);
      });
    } catch (e) {
      console.error('[FFAI] Service Worker orchestration error:', e);
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
    <PWAInstaller />
  </React.StrictMode>
);
