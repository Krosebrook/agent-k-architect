
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { FadeIn, Container, ParallaxSection } from '../ui/Library';
import { useCity } from '../../context/CityContext';

export const SystemTasksSection: React.FC = () => {
  const { state, addTask, removeTask, toggleTask } = useCity();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTask(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <ParallaxSection id="tasks" variant="light" className="py-32 bg-stone-50 dark:bg-stone-950">
      <Container>
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3">
            <FadeIn>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-fusion-bolt/10 text-fusion-bolt">
                  <ClipboardList size={24} />
                </div>
                <span className="text-xs font-bold tracking-[0.5em] uppercase text-stone-500">Maintenance</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif text-stone-900 dark:text-stone-50 mb-10 leading-tight">
                System <span className="italic text-fusion-bolt">Backlog</span>
              </h2>
              <p className="text-lg text-stone-500 dark:text-stone-400 font-light leading-relaxed mb-12">
                Operational tasks for the federated stack. All records are persisted to the local neural cache for consistent orchestration.
              </p>

              <form onSubmit={handleSubmit} className="relative group">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Record new maintenance entry..."
                  className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-fusion-bolt/30 dark:text-white transition-all outline-none"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-fusion-bolt dark:hover:bg-fusion-bolt dark:hover:text-white transition-all"
                >
                  <Plus size={20} />
                </button>
              </form>
            </FadeIn>
          </div>

          <div className="lg:w-2/3">
            <FadeIn delay={0.2}>
              <div className="bg-white dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="p-8 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-950/30">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={16} className="text-fusion-bolt" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Persistent Task Queue</span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-300">
                    {state.tasks.length} ENTRIES FOUND
                  </span>
                </div>

                <div className="max-h-[600px] overflow-y-auto p-4 md:p-8 space-y-4">
                  <AnimatePresence initial={false} mode="popLayout">
                    {state.tasks.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 text-center"
                      >
                        <p className="text-stone-400 text-sm italic">No maintenance tasks in the current cycle.</p>
                      </motion.div>
                    ) : (
                      state.tasks.map((task) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`group p-6 rounded-3xl border transition-all flex items-center justify-between gap-6 ${
                            task.completed 
                              ? 'bg-stone-50 dark:bg-stone-950/50 border-stone-100 dark:border-stone-900 opacity-60' 
                              : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-fusion-bolt/30 shadow-sm hover:shadow-xl'
                          }`}
                        >
                          <div className="flex items-center gap-6 flex-1">
                            <button 
                              onClick={() => toggleTask(task.id)}
                              className={`shrink-0 transition-colors ${task.completed ? 'text-emerald-500' : 'text-stone-300 hover:text-fusion-bolt'}`}
                            >
                              {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </button>
                            <div className="flex flex-col gap-1">
                              <span className={`text-sm md:text-base font-medium transition-all ${task.completed ? 'line-through text-stone-400' : 'text-stone-900 dark:text-stone-100'}`}>
                                {task.text}
                              </span>
                              <div className="flex items-center gap-2 text-[8px] font-black text-stone-400 uppercase tracking-widest">
                                <Calendar size={10} />
                                {new Date(task.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => removeTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 p-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-stone-300 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-8 border-t border-stone-100 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-950/20 text-[9px] font-bold text-stone-400 uppercase tracking-[0.3em] flex items-center justify-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Local Sync Active • Auto-persistence enabled
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </ParallaxSection>
  );
};
