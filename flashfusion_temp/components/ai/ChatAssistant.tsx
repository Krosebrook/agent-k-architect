
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  User, 
  Bot, 
  Zap, 
  Cpu, 
  Gauge, 
  Send, 
  Activity,
  Database,
  Server,
  DollarSign,
  Activity as Heartbeat,
  WifiOff
} from 'lucide-react';
import { InferenceGateway } from '../../services/aiService';
import { useNavigation } from '../../hooks/useNavigation';
import { useCity } from '../../context/CityContext';
import { InferenceMetrics, HubId } from '../../types';

interface Message {
  role: 'user' | 'model';
  text: string;
  metrics?: InferenceMetrics;
  cost?: number;
  modelUsed?: string;
  timestamp: number;
}

const QUICK_ACTIONS = [
  "Initialize H100 Boost",
  "Run Enclave Audit",
  "Add maintenance task",
  "Explain Data Isolation"
];

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "FFAI Bridge Online. Federated GPU clusters ready for orchestration. How shall we optimize the fabric?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { state, toggleDistrict, setTransitHub, resetSimulation, toggleGPUBooost, addTask } = useCity();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollToSection } = useNavigation();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isLoading, isOpen, scrollToBottom]);

  const handleSend = useCallback(async (text: string = input) => {
    const query = text.trim();
    if (!query || isLoading) return;

    if (!navigator.onLine) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Neural link severed. The federated gateway is physically isolated. Reconnect to resume orchestration.",
        timestamp: Date.now()
      }]);
      return;
    }

    const userMsg: Message = { role: 'user', text: query, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const gpuState = state.districts.AI.gpuAcceleration;
      const response = await InferenceGateway.chat(query, gpuState?.isBoosted, gpuState?.tflops);
      
      // Tool Execution Dispatcher
      if (response.functionCalls) {
        response.functionCalls.forEach(fc => {
          switch (fc.name) {
            case 'navigateToSection':
              scrollToSection((fc.args as any).sectionId)();
              break;
            case 'triggerSimulationEvent':
              const { eventType, targetId } = fc.args as any;
              if (eventType === 'FAIL_DISTRICT') toggleDistrict(targetId as HubId);
              else if (eventType === 'SWITCH_TRANSIT') setTransitHub(targetId as any);
              else if (eventType === 'RESET') resetSimulation();
              break;
            case 'toggleGPU':
              if (gpuState?.isBoosted !== (fc.args as any).active) toggleGPUBooost();
              break;
            case 'createMaintenanceTask':
              addTask((fc.args as any).text);
              break;
          }
        });
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text,
        metrics: response.metrics,
        cost: response.cost,
        modelUsed: response.modelUsed,
        timestamp: Date.now()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Neural relay failure. The federated gateway is temporarily isolated.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, state.districts.AI.gpuAcceleration, scrollToSection, toggleDistrict, setTransitHub, resetSimulation, toggleGPUBooost, addTask]);

  const isGPUActive = state.districts.AI.gpuAcceleration?.isBoosted;

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
            className="absolute bottom-24 right-0 w-[500px] max-w-[calc(100vw-2rem)] h-[700px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[3rem] shadow-5xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Cluster Telemetry Header */}
            <header className="px-8 py-6 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all duration-500 ${isGPUActive ? 'bg-fusion-bolt shadow-[0_0_20px_rgba(255,107,107,0.4)]' : 'bg-stone-800'}`}>
                    <Cpu size={24} className={isGPUActive ? 'animate-pulse' : ''} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 dark:text-stone-50 text-xl tracking-tight">FFAI Gateway</h4>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? (isGPUActive ? 'bg-emerald-500 animate-pulse' : 'bg-blue-400') : 'bg-red-500'}`} />
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-stone-400">
                        {!isOnline ? 'ISOLATED' : (isGPUActive ? 'ACCELERATED (H100)' : 'BASELINE (EDGE)')}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {!isOnline && (
                <div className="mx-8 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500">
                  <WifiOff size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Offline Mode: Local Caches Active</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800 flex flex-col gap-0.5">
                  <span className="text-[7px] font-bold text-stone-400 uppercase tracking-widest">Compute</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-500">{(state.districts.AI.gpuAcceleration?.tflops ?? 0).toFixed(0)} TFLOPS</span>
                </div>
                <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800 flex flex-col gap-0.5">
                  <span className="text-[7px] font-bold text-stone-400 uppercase tracking-widest">Protocol</span>
                  <span className="text-[10px] font-mono font-bold text-fusion-bolt uppercase">{state.transitHub} Relay</span>
                </div>
                <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800 flex flex-col gap-0.5">
                  <span className="text-[7px] font-bold text-stone-400 uppercase tracking-widest">Integrity</span>
                  <span className="text-[10px] font-mono font-bold text-blue-500">{state.districts.AI.health}% Nominal</span>
                </div>
              </div>
            </header>

            {/* Neural Conversation Thread */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide bg-stone-50/20 dark:bg-stone-950/10">
              {messages.map((msg, i) => (
                <motion.div 
                  key={`${msg.timestamp}-${i}`} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${msg.role === 'user' ? 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700' : 'bg-fusion-bolt/10 text-fusion-bolt border-fusion-bolt/20 shadow-inner'}`}>
                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                    <div className={`px-6 py-4 rounded-[1.8rem] text-[14px] leading-relaxed shadow-lg ${
                      msg.role === 'user' 
                        ? 'bg-stone-900 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-tl-none border border-stone-100 dark:border-stone-800'
                    }`}>
                      {msg.text}
                    </div>
                    
                    {msg.metrics && (
                      <div className="flex flex-wrap items-center gap-2 px-1">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-stone-100 dark:bg-stone-900 rounded-md text-[7px] font-black uppercase tracking-widest text-stone-500 border border-stone-200 dark:border-stone-800">
                          {msg.metrics.cached ? <Database size={9} className="text-blue-500" /> : <Heartbeat size={9} className="text-emerald-500" />}
                          {msg.metrics.cached ? 'L2 CACHE HIT' : msg.metrics.cluster}
                        </span>
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-stone-100 dark:bg-stone-900 rounded-md text-[7px] font-black uppercase tracking-widest text-stone-500 border border-stone-200 dark:border-stone-800">
                          <Gauge size={9} /> {msg.metrics.totalLatency}ms
                        </span>
                        {msg.cost !== undefined && (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-stone-100 dark:bg-stone-900 rounded-md text-[7px] font-black uppercase tracking-widest text-stone-500 border border-stone-200 dark:border-stone-800">
                            <DollarSign size={9} /> ${(msg.cost).toFixed(4)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-4 ml-14">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(n => (
                      <motion.div 
                        key={n}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: n * 0.15 }}
                        className="w-2 h-2 rounded-full bg-fusion-bolt shadow-[0_0_8px_rgba(255,107,107,0.5)]" 
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-400">Federated Sync...</span>
                </div>
              )}
            </div>

            {/* Input Overlay */}
            <div className="p-8 bg-white dark:bg-stone-950 border-t border-stone-100 dark:border-stone-800 space-y-5">
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map(s => (
                  <button 
                    key={s} 
                    onClick={() => handleSend(s)} 
                    className="text-[8px] font-bold uppercase tracking-widest px-3 py-2 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-500 hover:border-fusion-bolt hover:text-fusion-bolt transition-all bg-stone-50/50 dark:bg-stone-900/50"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isOnline ? "Ask about enclave status..." : "Gateway Isolated (Offline)"}
                  disabled={!isOnline}
                  className="w-full bg-stone-100 dark:bg-stone-900 border-none rounded-2xl px-6 py-4 pr-16 text-sm focus:ring-2 focus:ring-fusion-bolt/30 dark:text-white transition-all shadow-inner disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading || !isOnline}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 disabled:opacity-20 transition-all hover:bg-fusion-bolt dark:hover:bg-fusion-bolt dark:hover:text-white"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-2xl shadow-4xl flex items-center justify-center transition-all duration-500 group relative ${isOpen ? 'bg-stone-950 text-white rotate-90' : 'bg-fusion-bolt text-white hover:scale-110 shadow-[0_15px_30px_-5px_rgba(255,107,107,0.4)]'}`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? <X size={28} key="x" /> : <MessageSquare size={28} key="msg" />}
        </AnimatePresence>
        {!isOpen && (isGPUActive || !isOnline) && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-4 border-stone-50 dark:border-stone-950 shadow-lg ${isOnline ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-red-500 shadow-red-500/50'}`}
          />
        )}
      </button>
    </div>
  );
};
