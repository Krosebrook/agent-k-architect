
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Zap } from 'lucide-react';

export const PWAInstaller: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Delay visibility to ensure initial load is smooth
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Hide if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-32 left-8 right-8 md:left-auto md:right-8 md:w-96 z-[250]"
        >
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] shadow-5xl p-8 flex flex-col gap-6 backdrop-blur-xl">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-fusion-bolt rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Zap size={24} fill="white" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-50">Local Access</h4>
                  <p className="text-xs text-stone-500 uppercase tracking-widest font-bold">Install FlashFusion App</p>
                </div>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Experience seamless federated orchestration with full offline capabilities and high-concurrency access.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleInstall}
                className="flex-1 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-fusion-bolt dark:hover:bg-fusion-bolt dark:hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <Download size={16} />
                Install
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="px-6 py-4 border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
