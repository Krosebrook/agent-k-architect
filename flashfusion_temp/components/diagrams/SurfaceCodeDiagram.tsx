/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Activity, Cpu } from 'lucide-react';
import { Tooltip } from '../ui/Library';
import { HUBS_DATA } from '../../data/content';
import { useCity } from '../../context/CityContext';
import { HubId } from '../../types';

const SVG_SIZE = 400;
const CENTER = SVG_SIZE / 2;
const HUB_RADIUS = 145;

const getHubPos = (index: number) => {
  const angle = (index * (360 / 7) - 90) * (Math.PI / 180);
  return {
    x: CENTER + Math.cos(angle) * HUB_RADIUS,
    y: CENTER + Math.sin(angle) * HUB_RADIUS
  };
};

const getThemeColor = (colorClass: string) => {
  if (colorClass.includes('indigo')) return '#4F46E5';
  if (colorClass.includes('blue')) return '#2563EB';
  if (colorClass.includes('emerald')) return '#10B981';
  if (colorClass.includes('rose')) return '#E11D48';
  if (colorClass.includes('amber')) return '#D97706';
  if (colorClass.includes('violet')) return '#7C3AED';
  if (colorClass.includes('teal')) return '#0D9488';
  return '#C5A059';
};

export const HubArchitectureDiagram: React.FC = () => {
  const { state } = useCity();
  const [activeHub, setActiveHub] = useState<string | null>(null);
  
  const hubPositions = useMemo(() => 
    HUBS_DATA.map((_, i) => getHubPos(i)), []);

  const handleInteraction = useCallback((id: string | null) => {
    setActiveHub(id);
  }, []);

  const connections = useMemo(() => {
    const lines: Array<{
      id: string;
      source: { x: number; y: number };
      target: { x: number; y: number };
      sourceId: HubId;
      targetId: HubId;
      color: string;
    }> = [];
    
    const processed = new Set<string>();

    HUBS_DATA.forEach((hub, i) => {
      hub.connections.forEach(targetId => {
        const pair = [hub.id, targetId].sort().join('-');
        if (!processed.has(pair)) {
          const targetIdx = HUBS_DATA.findIndex(h => h.id === targetId);
          if (targetIdx !== -1) {
            lines.push({
              id: pair,
              source: hubPositions[i],
              target: hubPositions[targetIdx],
              sourceId: hub.id as HubId,
              targetId: targetId as HubId,
              color: getThemeColor(hub.color)
            });
            processed.add(pair);
          }
        }
      });
    });
    return lines;
  }, [hubPositions]);

  const currentHubData = useMemo(() => 
    HUBS_DATA.find(h => h.id === activeHub), [activeHub]);

  return (
    <div className="flex flex-col items-center p-12 bg-white dark:bg-stone-900 rounded-[5rem] shadow-6xl border border-stone-200 dark:border-stone-800 my-10 select-none transition-all duration-1000 relative overflow-visible w-full max-w-3xl mx-auto group/diagram">
      <header className="relative z-10 flex flex-col items-center gap-3 mb-12">
        <h3 className="font-serif text-5xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">
          Fabric Topology
        </h3>
        <div className="flex items-center gap-3 px-4 py-1.5 bg-fusion-bolt/5 rounded-full border border-fusion-bolt/10">
           <Activity size={12} className="text-fusion-bolt animate-pulse" />
           <span className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-400">Synchronized Mesh Active</span>
        </div>
      </header>
      
      <div className="relative z-10 flex items-center justify-center w-[400px] h-[400px]">
         <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
            <defs>
              <filter id="data-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
              <filter id="particle-glow" x="-100%" y="-100%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feFlood floodColor="#fff" floodOpacity="0.8" result="flood"/>
                <feComposite in="flood" in2="blur" operator="in" result="glow"/>
                <feMerge>
                  <feMergeNode in="glow"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {connections.map((conn) => {
                const sourceActive = state.districts[conn.sourceId].isActive;
                const targetActive = state.districts[conn.targetId].isActive;
                const isParticipating = activeHub === conn.sourceId || activeHub === conn.targetId;

                return (
                    <g key={conn.id}>
                        {/* Baseline Path */}
                        <path 
                            d={`M${conn.source.x},${conn.source.y} L${conn.target.x},${conn.target.y}`}
                            fill="none"
                            stroke={sourceActive && targetActive ? "#e7e5e4" : "#f87171"}
                            strokeWidth={1.5}
                            strokeOpacity={activeHub ? 0.08 : 0.25}
                            strokeDasharray={sourceActive && targetActive ? "0" : "6,6"}
                            className="dark:stroke-stone-700 transition-all duration-1000"
                        />
                        
                        <AnimatePresence>
                            {isParticipating && sourceActive && targetActive && (
                                <g>
                                  {/* Active Glowing Path */}
                                  <motion.path 
                                      d={`M${conn.source.x},${conn.source.y} L${conn.target.x},${conn.target.y}`}
                                      fill="none"
                                      stroke={conn.color}
                                      strokeWidth={3}
                                      initial={{ pathLength: 0, opacity: 0 }}
                                      animate={{ pathLength: 1, opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                                      filter="url(#data-glow)"
                                  />
                                  
                                  {/* Animated Data Flow Particles */}
                                  {[0, 1, 2].map((p) => (
                                    <motion.circle 
                                      key={p}
                                      r="3"
                                      fill="#ffffff"
                                      initial={{ offsetDistance: "0%" }}
                                      animate={{ offsetDistance: "100%" }}
                                      transition={{ 
                                        duration: 2, 
                                        repeat: Infinity, 
                                        ease: "linear",
                                        delay: p * 0.6,
                                        repeatDelay: 0.2
                                      }}
                                      style={{ 
                                        offsetPath: `path("M${conn.source.x},${conn.source.y} L${conn.target.x},${conn.target.y}")`,
                                        filter: 'url(#particle-glow)'
                                      }}
                                    />
                                  ))}
                                </g>
                            )}
                        </AnimatePresence>
                    </g>
                );
            })}
         </svg>

         {/* Central Fabric Core */}
         <motion.div 
            animate={{ 
              scale: state.simulationActive ? [1, 1.1, 1] : 1,
              rotate: state.simulationActive ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className={`absolute z-0 flex items-center justify-center w-40 h-40 border-2 border-dashed rounded-full bg-white dark:bg-stone-800 transition-all duration-1000 ${state.simulationActive ? 'border-fusion-bolt/50 shadow-2xl shadow-fusion-bolt/10' : 'border-stone-200 dark:border-stone-700'}`}
         >
             <div className="text-center">
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="flex justify-center gap-1 mb-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-fusion-bolt" />
                  <div className="w-1.5 h-1.5 rounded-full bg-fusion-bolt" />
                </motion.div>
                <span className="block text-2xl font-serif font-black text-fusion-bolt uppercase tracking-tighter leading-none">{state.transitHub}</span>
                <span className="block text-[8px] font-black text-stone-400 uppercase tracking-widest mt-1.5">RELAY HUB</span>
             </div>
         </motion.div>

         {HUBS_DATA.map((hub, i) => {
             const { x, y } = hubPositions[i];
             const isHovered = activeHub === hub.id;
             const status = state.districts[hub.id];
             const isDimmed = activeHub && !isHovered;
             const hubColor = getThemeColor(hub.color);

             return (
                 <motion.div 
                    key={hub.id} 
                    className="absolute top-1/2 left-1/2"
                    initial={{ x: x - CENTER, y: y - CENTER }}
                    animate={{ x: x - CENTER, y: y - CENTER, scale: isHovered ? 1.4 : 1 }} 
                    onMouseEnter={() => handleInteraction(hub.id)}
                    onMouseLeave={() => handleInteraction(null)}
                    style={{ zIndex: isHovered ? 60 : 20 }}
                 >
                    <Tooltip content={`${hub.label}: ${status.isActive ? 'Synced' : 'Isolated'}`}>
                        <motion.div
                            animate={{ 
                                opacity: isDimmed ? 0.2 : 1,
                                filter: status.isActive ? 'none' : 'grayscale(1) brightness(0.7)',
                                rotate: isHovered ? 8 : 0,
                                boxShadow: isHovered 
                                  ? `0 35px 70px -15px ${status.isActive ? hubColor : '#f87171'}AA` 
                                  : "0 12px 30px -10px rgba(0, 0, 0, 0.1)"
                            }}
                            className={`w-16 h-16 rounded-[1.8rem] flex flex-col items-center justify-center cursor-pointer text-white border-2 border-white/40 transition-all duration-700 overflow-hidden relative ${
                              status.isActive ? hub.color : 'bg-red-600'
                            }`}
                        >
                            <AnimatePresence>
                               {isHovered && (
                                 <motion.div 
                                    className="absolute inset-0 bg-white/20"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                 />
                               )}
                            </AnimatePresence>
                            {status.isActive ? <hub.icon size={26} className="mb-0.5 relative z-10" /> : <ShieldAlert size={26} className="relative z-10" />}
                            <span className="text-[7px] font-black tracking-[0.3em] opacity-90 uppercase relative z-10">{hub.id}</span>
                        </motion.div>
                    </Tooltip>
                 </motion.div>
             );
         })}
      </div>

      <div className="h-44 w-full mt-14 text-center">
        <AnimatePresence mode="wait">
             {activeHub && currentHubData ? (
                 <motion.div 
                    key={activeHub}
                    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className={`p-10 rounded-[3.5rem] border flex flex-col h-full transition-all duration-1000 shadow-xl ${
                      state.districts[currentHubData.id].isActive 
                        ? 'bg-stone-50/50 dark:bg-stone-800/20 border-stone-200 dark:border-stone-800' 
                        : 'bg-red-600/5 border-red-600/10'
                    }`}
                 >
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-left">
                        <motion.span 
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className={`font-black block uppercase tracking-[0.4em] text-[10px] mb-2 ${state.districts[currentHubData.id].isActive ? 'text-fusion-bolt' : 'text-red-500'}`}>
                          {state.districts[currentHubData.id].isActive ? 'DOMAIN SYNCHRONIZED' : 'CONNECTION SEVERED'}
                        </motion.span>
                        <h4 className="text-3xl font-serif font-bold dark:text-white tracking-tight leading-none">{currentHubData.label}</h4>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-700 flex items-center justify-center shadow-lg">
                        <currentHubData.icon size={24} className="text-fusion-bolt" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-left mt-auto">
                       {currentHubData.subPlatforms.slice(0, 4).map((sp, idx) => (
                         <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + idx * 0.05 }}
                          className="flex flex-col group/item"
                         >
                            <span className="text-[12px] font-black text-stone-900 dark:text-stone-100 truncate group-hover/item:text-fusion-bolt transition-colors">{sp.name}</span>
                            <span className="text-[9px] text-stone-400 uppercase font-black tracking-widest">{sp.role}</span>
                         </motion.div>
                       ))}
                    </div>
                 </motion.div>
             ) : (
                 <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-8">
                    <motion.div 
                      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="p-8 rounded-full border border-dashed border-stone-200 dark:border-stone-800"
                    >
                      <Cpu size={48} className="opacity-20" />
                    </motion.div>
                    <span className="text-[12px] font-black tracking-[0.6em] uppercase opacity-40">
                      Topological Fabric Matrix
                    </span>
                 </div>
             )}
        </AnimatePresence>
      </div>
    </div>
  );
};