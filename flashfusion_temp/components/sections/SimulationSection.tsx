
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, ShieldAlert, RefreshCw, Power, Zap } from 'lucide-react';
import { FadeIn, ParallaxSection, Container, Tooltip } from '../ui/Library';
import { useCity } from '../../context/CityContext';
import { HUBS_DATA } from '../../data/content';
import { GPUInferenceDiagram } from '../Diagrams';

/**
 * SimulationSection Component
 * 
 * Provides an interactive "architectural sandbox" where users can toggle 
 * enclaves on/off to analyze fabric failover resilience and GPU scaling.
 */
export const SimulationSection: React.FC = () => {
  const { state, toggleDistrict, setTransitHub, resetSimulation, toggleGPUBooost } = useCity();
  const isBoosted = state.districts.AI.gpuAcceleration?.isBoosted;

  return (
    <ParallaxSection id="simulation" variant="dark">
      <Container>
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3">
            <FadeIn>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-fusion-bolt/20 text-fusion-bolt">
                  <Terminal size={24} />
                </div>
                <span className="text-xs font-bold tracking-[0.4em] uppercase text-stone-400">Control Interface</span>
              </div>
              <h2 className="text-5xl font-serif text-white mb-8 leading-tight">Neural <span className="italic">Sandbox</span></h2>
              <p className="text-xl font-light text-stone-400 leading-relaxed mb-10">
                Calibrate the federated compute fabric. Toggle high-density H100 GPU clusters to observe inference throughput spikes and VRAM allocation.
              </p>
              
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-4">Active Sync Protocol</span>
                  <div className="flex gap-2">
                    {['n8n', 'Zapier', 'Manual'].map(hub => (
                      <button
                        key={hub}
                        onClick={() => setTransitHub(hub as any)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${
                          state.transitHub === hub 
                            ? 'bg-fusion-bolt text-white shadow-lg shadow-fusion-bolt/20' 
                            : 'bg-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        {hub}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-3xl transition-colors duration-1000 ${isBoosted ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-stone-900 border-stone-800'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isBoosted ? 'text-emerald-400' : 'text-stone-500'}`}>H100 Tensor Overclock</span>
                    <div className={`px-2 py-1 rounded text-[8px] font-bold uppercase ${isBoosted ? 'bg-fusion-bolt text-white animate-pulse' : 'bg-stone-800 text-stone-500'}`}>
                      {isBoosted ? 'MAX PERFORMANCE' : 'STEADY STATE'}
                    </div>
                  </div>
                  <button 
                    onClick={toggleGPUBooost}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-lg ${
                      isBoosted 
                        ? 'bg-fusion-bolt text-white shadow-fusion-bolt/30' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/40'
                    }`}
                  >
                    {isBoosted ? <Zap size={16} fill="white" /> : <Power size={16} />}
                    {isBoosted ? 'Deactivate Overclock' : 'Engage GPU Clusters'}
                  </button>
                </div>

                <button 
                  onClick={resetSimulation}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-full border border-stone-800 text-stone-500 hover:border-fusion-bolt hover:text-fusion-bolt transition-all"
                >
                  <RefreshCw size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Re-Initialize Fabric</span>
                </button>
              </div>
            </FadeIn>
          </div>

          <div className="lg:w-2/3 flex flex-col gap-12">
            <FadeIn delay={0.2}>
              <GPUInferenceDiagram />
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {HUBS_DATA.map((hub, idx) => {
                const status = state.districts[hub.id];
                return (
                  <FadeIn key={hub.id} delay={idx * 0.05}>
                    <div className={`p-8 rounded-[3rem] border transition-all duration-700 bg-stone-900/60 backdrop-blur-xl group ${
                      status.isActive 
                        ? 'border-stone-800 hover:border-fusion-bolt/30' 
                        : 'border-red-900/50 bg-red-950/20'
                    }`}>
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl ${hub.color} text-white shadow-xl`}>
                          <hub.icon size={24} />
                        </div>
                        <Tooltip content={status.isActive ? "Enclave Synced" : "Domain Offline"}>
                          <button 
                            onClick={() => toggleDistrict(hub.id)}
                            className={`p-3 rounded-full transition-all ${
                              status.isActive 
                                ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
                                : 'bg-red-500 text-white animate-pulse'
                            }`}
                          >
                            <Power size={20} />
                          </button>
                        </Tooltip>
                      </div>

                      <h4 className="text-2xl font-serif font-bold text-white mb-2">{hub.label}</h4>
                      <p className="text-sm text-stone-500 font-light mb-8 leading-relaxed">{hub.desc}</p>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-stone-500">Resource Load</span>
                          <span className={status.isActive ? 'text-fusion-metro' : 'text-stone-600'}>
                            {status.isActive ? `${status.load.toFixed(1)}%` : 'ISOLATED'}
                          </span>
                        </div>
                        <div className="h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${status.isActive ? status.load : 0}%` }}
                            className={`h-full transition-all duration-500 ${status.load > 85 ? 'bg-red-500' : 'bg-fusion-bolt'}`}
                          />
                        </div>
                      </div>

                      {!status.isActive && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 flex items-center gap-3 text-red-500 bg-red-500/10 p-4 rounded-2xl border border-red-500/20"
                        >
                          <ShieldAlert size={18} />
                          <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Redirecting via {state.transitHub} Failover</span>
                        </motion.div>
                      )}
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </ParallaxSection>
  );
};
