
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Layout, Shield, Database, FileJson, CheckCircle2, RefreshCw, Activity, Info, Sparkles, Send } from 'lucide-react';
import { FLOW_PACKETS } from '../../data/content';
import { Tooltip } from '../ui/Library';

/**
 * IntegrationLayerDiagram Component
 * 
 * Visualizes the data sync pipeline between federated systems.
 * Refactored with high-performance animations and holographic depth.
 */
export const IntegrationLayerDiagram: React.FC = () => {
  const [activePacketIndex, setActivePacketIndex] = useState(0);
  const [flowStep, setFlowStep] = useState(0); // 0: Origin, 1: Translator, 2: Destination

  useEffect(() => {
    const stageDuration = 4500; 
    const interval = setInterval(() => {
        setFlowStep(prev => {
            if (prev >= 2) {
                setActivePacketIndex(p => (p + 1) % FLOW_PACKETS.length);
                return 0;
            }
            return prev + 1;
        });
    }, stageDuration); 
    
    return () => clearInterval(interval);
  }, []);

  const packet = useMemo(() => FLOW_PACKETS[activePacketIndex], [activePacketIndex]);

  return (
    <div className="flex flex-col items-center w-full max-w-6xl p-16 md:p-32 my-20 border border-stone-200 dark:border-stone-800 rounded-[7rem] bg-white dark:bg-stone-950/40 backdrop-blur-3xl shadow-[0_100px_200px_-50px_rgba(0,0,0,0.15)] relative overflow-hidden group">
      
      {/* Background Pipeline Layer */}
      <div className="absolute top-[50%] left-24 right-24 h-4 bg-stone-100 dark:bg-stone-900/50 -translate-y-1/2 z-0 hidden lg:block rounded-full shadow-inner overflow-hidden">
        <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-fusion-bolt to-emerald-500 blur-[2px]"
            initial={{ width: '0%' }}
            animate={{ width: `${(flowStep + 1) * 33.3}%` }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] bg-[length:300px_100%]"
          animate={{ x: ['-100%', '250%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <header className="flex flex-col lg:flex-row items-center justify-between w-full mb-40 relative z-10 gap-12">
          <div className="text-center lg:text-left">
            <motion.h3 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-serif text-7xl lg:text-9xl font-bold text-stone-900 dark:text-stone-50 leading-none tracking-tighter"
            >
              Protocol-Sync
            </motion.h3>
            <div className="flex items-center gap-5 mt-8 justify-center lg:justify-start">
               <div className="h-0.5 w-16 bg-fusion-bolt/40" />
               <p className="text-stone-400 font-light italic text-3xl tracking-tight">
                Federated Integrity Layer V4.5
               </p>
            </div>
          </div>
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              boxShadow: [
                '0 0 0 0 rgba(255,107,107,0)',
                '0 0 40px 5px rgba(255,107,107,0.2)',
                '0 0 0 0 rgba(255,107,107,0)'
              ]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-5 text-[14px] font-black uppercase tracking-[0.6em] text-fusion-bolt border-2 border-fusion-bolt/20 px-16 py-8 rounded-[3rem] bg-fusion-bolt/[0.03] shadow-2xl backdrop-blur-md"
          >
            <Activity size={24} className="animate-pulse" />
            FABRIC_HEARTBEAT
          </motion.div>
      </header>

      <div className="grid w-full grid-cols-1 gap-20 lg:grid-cols-3 relative z-10 min-h-[580px]">
        
        {/* Step 1: Genesis Node */}
        <StationCard 
          isActive={flowStep === 0}
          title="Ingress"
          tagline="Event Capture"
          tooltip="Initial collection point for CRM and User events."
          icon={Layout}
          activeColor="bg-blue-600"
          accentColor="rgba(37, 99, 235, 0.4)"
        >
          <AnimatePresence mode="wait">
            {flowStep === 0 && (
              <motion.div 
                key="ingress-obj"
                initial={{ opacity: 0, scale: 0.4, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, x: 300, scale: 0.6, filter: 'blur(15px)' }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="w-36 h-36 bg-blue-600 text-white rounded-[3.5rem] flex flex-col items-center justify-center shadow-6xl border-4 border-blue-400/30 relative"
              >
                <FileJson size={54} />
                <span className="text-[12px] font-black mt-5 tracking-[0.4em]">JSON_OBJ</span>
                <motion.div 
                  className="absolute -inset-6 border-2 border-dashed border-blue-400/20 rounded-[4rem]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </StationCard>

        {/* Step 2: Transformation Node */}
        <StationCard 
          isActive={flowStep === 1}
          title="Synthesis"
          tagline="Logic Relay"
          tooltip="Schema normalization and routing via n8n core."
          icon={RefreshCw}
          activeColor="bg-fusion-bolt"
          accentColor="rgba(255, 107, 107, 0.4)"
          iconAnimation={{ rotate: 360 }}
        >
          <AnimatePresence mode="wait">
            {flowStep === 1 && (
              <motion.div 
                key="sync-pulse"
                initial={{ opacity: 0, x: -300, scale: 0.5, filter: 'blur(15px)' }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: [1, 1.2, 1],
                  rotateZ: 360
                }}
                exit={{ opacity: 0, x: 300, scale: 0.5, filter: 'blur(15px)' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-40 h-40 bg-fusion-bolt text-white rounded-full flex flex-col items-center justify-center shadow-7xl ring-[35px] ring-fusion-bolt/10 relative"
              >
                <Layers size={64} />
                <span className="text-[13px] font-black mt-5 tracking-[0.5em] uppercase">SYNC_OP</span>
                <Sparkles className="absolute top-4 right-4 text-white/40 animate-pulse" size={28} />
              </motion.div>
            )}
          </AnimatePresence>
        </StationCard>

        {/* Step 3: Persistence Node */}
        <StationCard 
          isActive={flowStep === 2}
          title="Commit"
          tagline="Canonical Store"
          tooltip="Final state persistence in the Data Enclave."
          icon={Shield}
          activeColor="bg-emerald-600"
          accentColor="rgba(16, 185, 129, 0.4)"
        >
          <AnimatePresence mode="wait">
            {flowStep === 2 && (
              <motion.div 
                key="commit-res"
                initial={{ opacity: 0, x: -300, scale: 0.6, filter: 'blur(15px)' }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 180, damping: 20 }}
                className="w-36 h-36 bg-emerald-600 text-white rounded-[3.5rem] flex flex-col items-center justify-center shadow-6xl border-4 border-emerald-400/30 relative"
              >
                <Database size={54} />
                <motion.div 
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, type: "spring", damping: 10 }}
                  className="absolute -top-10 -right-10 bg-white dark:bg-stone-900 rounded-full p-4 border-[10px] border-emerald-500 shadow-4xl"
                >
                  <CheckCircle2 size={36} className="text-emerald-500" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </StationCard>
      </div>

      <footer className="mt-40 w-full max-w-6xl bg-stone-50/80 dark:bg-stone-900/40 p-16 rounded-[5rem] border border-stone-200 dark:border-stone-800 shadow-3xl backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-12">
          <div className="flex flex-col gap-5 text-center lg:text-left">
            <div className="flex items-center gap-5 justify-center lg:justify-start">
              <Activity size={22} className="text-fusion-bolt animate-pulse" />
              <span className="text-[14px] font-black text-stone-500 uppercase tracking-[0.6em]">Protocol Transaction</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.span 
                  key={packet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-6xl font-serif font-bold text-stone-900 dark:text-stone-50 italic tracking-tight leading-none"
              >
                  {packet.label}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex gap-10">
            {[0, 1, 2].map(s => (
              <motion.div 
                key={s}
                animate={{ 
                  scale: s === flowStep ? 3 : 1,
                  backgroundColor: s === flowStep ? "#FF6B6B" : "rgba(168, 162, 158, 0.2)",
                  boxShadow: s === flowStep ? "0 0 30px rgba(255,107,107,0.4)" : "none"
                }}
                className="w-4 h-4 rounded-full transition-all duration-1000"
              />
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div 
            key={packet.desc}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-start gap-8 border-l-[14px] border-fusion-bolt/20 pl-16 py-6"
          >
            <Send size={32} className="text-fusion-bolt/30 mt-2 shrink-0" />
            <p className="text-2xl text-stone-500 dark:text-stone-400 text-left leading-relaxed font-light italic">
              {packet.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </footer>
    </div>
  );
};

const StationCard: React.FC<{
  isActive: boolean;
  title: string;
  tagline: string;
  tooltip: string;
  icon: React.ElementType;
  activeColor: string;
  accentColor: string;
  iconAnimation?: any;
  children: React.ReactNode;
}> = ({ isActive, title, tagline, tooltip, icon: Icon, activeColor, accentColor, iconAnimation, children }) => (
  <Tooltip content={tooltip} position="top" className="w-full h-full">
    <motion.div 
        animate={{ 
          scale: isActive ? 1.08 : 1,
          boxShadow: isActive ? `0 80px 140px -40px ${accentColor}` : "0 15px 40px -20px rgba(0,0,0,0.05)",
          borderColor: isActive ? accentColor : "rgba(168, 162, 158, 0.08)",
          y: isActive ? -20 : 0
        }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="relative flex flex-col justify-between h-full p-20 bg-white dark:bg-stone-800/20 border-2 rounded-[6rem] transition-all duration-1000 overflow-hidden cursor-help group"
    >
        <AnimatePresence>
          {isActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-current opacity-5 pointer-events-none"
              style={{ color: activeColor.replace('bg-', '') }}
            />
          )}
        </AnimatePresence>

        <div className="text-center mb-20 relative z-10">
            <motion.div 
              animate={isActive ? (iconAnimation || { y: [0, -15, 0] }) : {}}
              transition={isActive ? { repeat: Infinity, duration: 4, ease: "easeInOut" } : {}}
              className={`inline-flex items-center justify-center w-28 h-28 mb-12 rounded-[3rem] transition-all duration-1000 ${isActive ? `${activeColor} text-white shadow-5xl scale-110 rotate-12` : 'bg-stone-100 dark:bg-stone-700/40 text-stone-400'}`}
            >
                <Icon size={48} />
            </motion.div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <h4 className="font-serif font-black text-5xl text-stone-900 dark:text-stone-50 tracking-tight leading-none">{title}</h4>
              <Info size={20} className="text-stone-300 dark:text-stone-600 group-hover:text-fusion-bolt transition-colors" />
            </div>
            <p className="text-[14px] font-black text-stone-400 uppercase tracking-[0.6em] mt-8 opacity-80">{tagline}</p>
        </div>
        
        <div className="flex-grow flex items-center justify-center relative min-h-[220px] z-10">
            {children}
        </div>
        
        {isActive && (
          <motion.div 
            className="absolute bottom-0 left-0 h-3 bg-current opacity-40"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 4.5, ease: "linear" }}
          />
        )}
    </motion.div>
  </Tooltip>
);
