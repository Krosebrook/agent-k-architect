
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, useSpring, useTransform, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Tooltip } from '../ui/Library';
import { COST_TIERS } from '../../data/content';
import { TrendingDown, ChevronRight, BarChart3, ShieldCheck, DollarSign } from 'lucide-react';

/** 
 * High-performance spring-based count up for financial data.
 */
const CountUp: React.FC<{ value: number }> = ({ value }) => {
  const spring = useSpring(0, { bounce: 0, duration: 2500, stiffness: 40, damping: 25 });
  const displayValue = useTransform(spring, (current) => Math.round(current));
  
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{displayValue}</motion.span>;
};

/**
 * CostAnalysisDiagram Component
 * 
 * High-impact financial visualization for federated platform metrics.
 */
export const CostAnalysisDiagram: React.FC = () => {
    const [activeTier, setActiveTier] = useState<number | null>(null);
    
    const totalCost = useMemo(() => {
      const sum = COST_TIERS.reduce((acc, curr) => acc + curr.cost, 0);
      return sum > 0 ? sum : 1;
    }, []);

    const RADIUS = 40;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    const handleHover = useCallback((id: number | null) => {
      setActiveTier(id);
    }, []);

    const selectedTierData = useMemo(() => 
      COST_TIERS.find(t => t.id === activeTier), [activeTier]);

    return (
      <LayoutGroup>
        <div className="flex flex-col lg:flex-row items-stretch gap-16 p-16 md:p-32 my-20 border border-stone-800 shadow-[0_120px_240px_-60px_rgba(0,0,0,0.85)] bg-stone-950 text-stone-100 rounded-[7rem] overflow-hidden relative group/metrics">
            
            {/* Background Atmosphere */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
               <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.15, 0.25, 0.15]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-1/3 -left-1/3 w-full h-full bg-gradient-to-br from-fusion-bolt/30 to-transparent blur-[220px] rounded-full"
               />
               <motion.div 
                animate={{ 
                  scale: [1.3, 1, 1.3],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                className="absolute -bottom-1/3 -right-1/3 w-full h-full bg-gradient-to-tr from-blue-500/20 to-transparent blur-[250px] rounded-full"
               />
            </div>
            
            <div className="flex-1 w-full relative z-10 flex flex-col justify-between">
                <header className="mb-24">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-8 mb-10"
                  >
                    <div className="p-6 rounded-[2rem] bg-white/5 backdrop-blur-3xl text-fusion-bolt shadow-6xl border border-white/10 ring-1 ring-fusion-bolt/20">
                      <TrendingDown size={44} />
                    </div>
                    <div>
                      <span className="text-[14px] font-black uppercase tracking-[0.7em] text-fusion-bolt mb-2 block">Economic Distribution</span>
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-[0.4em]">Audit Active: Q1 2025</span>
                      </div>
                    </div>
                  </motion.div>
                  <h3 className="text-7xl md:text-[6.5rem] font-serif font-bold text-white mb-12 leading-[0.85] tracking-tighter">
                      Federated <span className="italic text-stone-400">Equity</span>
                  </h3>
                  <div className="flex items-center gap-10 border-l-[3px] border-fusion-bolt/20 pl-14 py-4">
                    <p className="text-stone-400 text-4xl leading-relaxed font-light">
                      Platform Baseline: <span className="text-white font-black italic">$<CountUp value={totalCost} />k</span> /yr
                    </p>
                    <ShieldCheck className="text-emerald-500/30" size={40} />
                  </div>
                </header>

                <div className="space-y-14" role="list">
                    {COST_TIERS.map((tier, idx) => {
                         const isSelected = activeTier === tier.id;
                         return (
                           <motion.div 
                              key={tier.id} 
                              className="relative cursor-pointer group/tier"
                              onMouseEnter={() => handleHover(tier.id)}
                              onMouseLeave={() => handleHover(null)}
                              role="listitem"
                              initial={{ opacity: 0, x: -80 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                           >
                              <div className="flex justify-between items-end mb-6">
                                  <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-5">
                                      <motion.div 
                                          animate={isSelected ? { scale: 1.5, rotate: 90, color: "#FF6B6B" } : { scale: 1, rotate: 0, color: "#444" }}
                                          className="transition-all duration-500"
                                      >
                                          <ChevronRight size={24} />
                                      </motion.div>
                                      <span className={`text-xl font-black uppercase tracking-[0.5em] transition-all duration-1000 ${isSelected ? "text-fusion-bolt translate-x-6" : "text-stone-600"}`}>
                                          {tier.label}
                                      </span>
                                    </div>
                                    <AnimatePresence>
                                      {isSelected && (
                                        <motion.div 
                                          initial={{ opacity: 0, x: -20, height: 0 }} 
                                          animate={{ opacity: 1, x: 0, height: 'auto' }} 
                                          exit={{ opacity: 0, x: 20, height: 0 }}
                                          className="text-[16px] text-stone-500 font-light italic max-w-md pl-14 leading-relaxed border-l-2 border-fusion-bolt/10 overflow-hidden"
                                        >
                                          {tier.desc}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center justify-end gap-2 text-white">
                                       <DollarSign size={24} className="text-fusion-bolt opacity-40" />
                                       <span className={`font-serif text-6xl md:text-7xl transition-all duration-1000 block ${isSelected ? "text-fusion-bolt scale-110" : "text-stone-400"}`}>
                                          <CountUp value={tier.cost} />k
                                       </span>
                                    </div>
                                    <span className="text-[11px] font-black text-stone-700 uppercase tracking-[0.3em] mt-2 block">Allocated OpEx</span>
                                  </div>
                              </div>
                              <div className="w-full h-10 overflow-hidden rounded-[1.2rem] bg-stone-900/60 border border-stone-800/80 p-2 relative transition-all duration-1000 shadow-inner">
                                  <motion.div 
                                      className={`h-full rounded-[0.8rem] ${tier.color} relative shadow-2xl`}
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${(tier.cost / totalCost) * 100}%` }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 2.5, delay: 0.5, ease: [0.33, 1, 0.68, 1] }}
                                  >
                                    <motion.div 
                                      className="absolute inset-0 bg-white/20 blur-2xl rounded-full"
                                      animate={{ x: ['-250%', '250%'] }}
                                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />
                                  </motion.div>
                              </div>
                           </motion.div>
                         );
                    })}
                </div>
            </div>
            
            <div className="relative flex items-center justify-center p-24 border border-stone-800 bg-stone-900/40 backdrop-blur-4xl shrink-0 w-full lg:w-[600px] h-[850px] rounded-[6rem] shadow-7xl group/chart overflow-hidden">
                 {/* Visual Orbitals */}
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-20 rounded-full border border-dashed border-fusion-bolt/10 pointer-events-none" 
                 />
                 <motion.div 
                   animate={{ rotate: -360 }}
                   transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-32 rounded-full border border-dotted border-stone-800 pointer-events-none" 
                 />

                 <div className="relative w-[420px] h-[420px]">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
                        {COST_TIERS.map((tier, i) => {
                            const offsetValue = COST_TIERS.slice(0, i).reduce((acc, t) => acc + t.cost, 0);
                            const offsetPercent = (offsetValue / totalCost) * 100;
                            const segmentLength = (tier.cost / totalCost) * CIRCUMFERENCE;
                            const dashOffset = -((offsetPercent / 100) * CIRCUMFERENCE);
                            const isSelected = activeTier === tier.id;

                            return (
                                <Tooltip key={tier.id} content={`${tier.label}: $${tier.cost}k`}>
                                    <motion.circle
                                        cx="50" cy="50" r={RADIUS}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={isSelected ? 24 : 18}
                                        strokeLinecap="round"
                                        className={`${tier.color} transition-all duration-1000 cursor-pointer`}
                                        style={{ color: tier.color }}
                                        
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 3, delay: i * 0.2, ease: "circOut" }}
                                        
                                        strokeDasharray={`${segmentLength} ${CIRCUMFERENCE}`}
                                        strokeDashoffset={dashOffset}
                                        
                                        onMouseEnter={() => handleHover(tier.id)}
                                        onMouseLeave={() => handleHover(null)}
                                        
                                        animate={{
                                          strokeWidth: isSelected ? 28 : 18,
                                          scale: isSelected ? 1.1 : 1,
                                          filter: isSelected ? 'brightness(1.4) drop-shadow(0 0 30px currentColor)' : 'none'
                                        }}
                                    />
                                </Tooltip>
                            );
                        })}
                    </svg>
                    
                    {/* Central Value Matrix */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <AnimatePresence mode="wait">
                          <motion.div 
                            key={activeTier ?? 'total'}
                            initial={{ opacity: 0, scale: 0.8, filter: 'blur(15px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.2, filter: 'blur(15px)' }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            className="flex flex-col items-center text-center px-12"
                          >
                            <span className="text-8xl md:text-9xl font-serif font-black text-white tracking-tighter drop-shadow-7xl">
                              $<CountUp value={activeTier ? (selectedTierData?.cost ?? totalCost) : totalCost} />k
                            </span>
                            <motion.div 
                              layoutId="center-divider-eco"
                              className="w-32 h-1.5 bg-fusion-bolt/50 my-12 shadow-[0_0_30px_rgba(255,107,107,0.7)] rounded-full" 
                            />
                            <motion.span 
                              layoutId="center-label-eco"
                              className="text-[14px] font-black text-stone-500 uppercase tracking-[0.6em] leading-tight max-w-xs"
                            >
                              {activeTier ? selectedTierData?.label : 'Consolidated Baseline'}
                            </motion.span>
                          </motion.div>
                        </AnimatePresence>
                    </div>
                 </div>

                 <div className="absolute inset-16 rounded-[6rem] border-2 border-stone-800/40 pointer-events-none shadow-inner" />
            </div>
        </div>
      </LayoutGroup>
    )
}
