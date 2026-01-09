
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { CityState, CityContextType, HubId, DistrictStatus, Task } from '../types';

const INITIAL_DISTRICTS: HubId[] = ['DEV', 'DATA', 'AI', 'OPS', 'GROWTH', 'COMMERCE', 'COLLAB'];
const STORAGE_KEY = 'flashfusion_tasks';

const CityContext = createContext<CityContextType | undefined>(undefined);

/**
 * CityProvider
 * Manages the global architectural state and simulation overrides.
 * Orchestrates real-time telemetry updates across all 7 enclaves.
 * Now includes persistent task management via localStorage.
 */
export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load tasks from localStorage on initialization
  const [tasks, setTasks] = useState<readonly Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Failed to load tasks from localStorage:", e);
      return [];
    }
  });

  const [state, setState] = useState<{
    districts: Record<HubId, DistrictStatus>;
    transitHub: 'n8n' | 'Zapier' | 'Manual';
    simulationActive: boolean;
  }>(() => ({
    districts: INITIAL_DISTRICTS.reduce((acc, id) => ({
      ...acc,
      [id]: { 
        id, 
        isActive: true, 
        load: 15 + Math.random() * 20, 
        health: 100,
        ...(id === 'AI' ? {
          gpuAcceleration: { isBoosted: false, tflops: 120, vramUsed: 32 }
        } : {})
      }
    }), {} as Record<HubId, DistrictStatus>),
    transitHub: 'n8n',
    simulationActive: false
  }));

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to persist tasks to localStorage:", e);
    }
  }, [tasks]);

  /**
   * Global Telemetry Loop
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const newDistricts = { ...prev.districts };
        
        Object.keys(newDistricts).forEach(key => {
          const id = key as HubId;
          const dist = newDistricts[id];
          
          if (dist.isActive) {
            const loadDelta = (Math.random() - 0.5) * 5;
            dist.load = Math.max(5, Math.min(98, dist.load + loadDelta));
            
            if (id === 'AI' && dist.gpuAcceleration) {
              const isBoosted = dist.gpuAcceleration.isBoosted;
              const targetTflops = isBoosted ? 920 : 120;
              const targetVram = isBoosted ? 74 : 32;
              
              dist.gpuAcceleration = {
                ...dist.gpuAcceleration,
                tflops: targetTflops + (Math.random() - 0.5) * (isBoosted ? 150 : 20),
                vramUsed: Math.min(80, targetVram + (Math.random() - 0.5) * 8)
              };
            }
          }
        });

        return { ...prev, districts: newDistricts };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleDistrict = useCallback((id: HubId) => {
    setState(prev => {
      const current = prev.districts[id];
      const newStatus = !current.isActive;
      return {
        ...prev,
        districts: {
          ...prev.districts,
          [id]: { 
            ...current, 
            isActive: newStatus,
            health: newStatus ? 100 : 0,
            load: newStatus ? 20 : 0
          }
        },
        simulationActive: true
      };
    });
  }, []);

  const toggleGPUBooost = useCallback(() => {
    setState(prev => {
      const aiDist = prev.districts.AI;
      if (!aiDist.gpuAcceleration) return prev;

      return {
        ...prev,
        districts: {
          ...prev.districts,
          AI: {
            ...aiDist,
            gpuAcceleration: {
              ...aiDist.gpuAcceleration,
              isBoosted: !aiDist.gpuAcceleration.isBoosted
            }
          }
        }
      };
    });
  }, []);

  const setTransitHub = useCallback((hub: 'n8n' | 'Zapier' | 'Manual') => {
    setState(prev => ({ ...prev, transitHub: hub, simulationActive: true }));
  }, []);

  const resetSimulation = useCallback(() => {
    setState({
      districts: INITIAL_DISTRICTS.reduce((acc, id) => ({
        ...acc,
        [id]: { 
          id, 
          isActive: true, 
          load: 15 + Math.random() * 20, 
          health: 100,
          ...(id === 'AI' ? {
            gpuAcceleration: { isBoosted: false, tflops: 120, vramUsed: 32 }
          } : {})
        }
      }), {} as Record<HubId, DistrictStatus>),
      transitHub: 'n8n',
      simulationActive: false
    });
  }, []);

  // Task Management Handlers
  const addTask = useCallback((text: string) => {
    setTasks(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        completed: false,
        timestamp: Date.now()
      }
    ]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  }, []);

  const combinedState = useMemo(() => ({
    ...state,
    tasks
  }), [state, tasks]);

  const contextValue = useMemo(() => ({
    state: combinedState,
    toggleDistrict,
    setTransitHub,
    resetSimulation,
    toggleGPUBooost,
    addTask,
    removeTask,
    toggleTask
  }), [combinedState, toggleDistrict, setTransitHub, resetSimulation, toggleGPUBooost, addTask, removeTask, toggleTask]);

  return <CityContext.Provider value={contextValue}>{children}</CityContext.Provider>;
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) throw new Error('useCity must be used within CityProvider.');
  return context;
};
