
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, memo } from 'react';
import { BaseProps } from '../types';

/** 
 * Standardized High-Fidelity Loading State for Architectural Visualizations.
 * Provides a skeleton with a themed spinner and pulse animation.
 */
const DiagramFallback = () => (
  <div className="w-full h-full min-h-[450px] flex flex-col items-center justify-center bg-stone-100/30 dark:bg-stone-900/30 rounded-[4rem] border border-dashed border-stone-200 dark:border-stone-800 animate-pulse backdrop-blur-md transition-all duration-700">
    <div className="relative">
      <div className="w-16 h-16 border-2 border-fusion-bolt/20 rounded-full" />
      <div className="absolute inset-0 w-16 h-16 border-2 border-fusion-bolt border-t-transparent rounded-full animate-spin" />
    </div>
    <div className="mt-8 flex flex-col items-center gap-2">
      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-fusion-bolt/60">Neural Fabric Sync</span>
      <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-stone-400">Loading Architectural Topology...</span>
    </div>
  </div>
);

/** Generic type for complex diagram components supporting pass-through props */
type DiagramComponent = React.FC<BaseProps & Record<string, any>>;

// --- Lazy Component Definitions ---
// These are defined outside the render cycle to prevent unnecessary module re-evaluation.

const LazyHubArchitectureDiagram = lazy(() => 
  import('./diagrams/SurfaceCodeDiagram').then(m => ({ default: m.HubArchitectureDiagram }))
);

const LazyIntegrationLayerDiagram = lazy(() => 
  import('./diagrams/TransformerDecoderDiagram').then(m => ({ default: m.IntegrationLayerDiagram }))
);

const LazyCostAnalysisDiagram = lazy(() => 
  import('./diagrams/PerformanceMetricDiagram').then(m => ({ default: m.CostAnalysisDiagram }))
);

const LazyGPUInferenceDiagram = lazy(() => 
  import('./diagrams/GPUInferenceDiagram').then(m => ({ default: m.GPUInferenceDiagram }))
);

const LazyNOCDashboard = lazy(() => 
  import('./diagrams/NOCDashboard').then(m => ({ default: m.NOCDashboard }))
);

// --- Memoized & Suspended Exports ---
// Each export encapsulates its own Suspense boundary for granular error isolation and loading management.

export const HubArchitectureDiagram: DiagramComponent = memo((props) => (
  <Suspense fallback={<DiagramFallback />}>
    <LazyHubArchitectureDiagram {...props} />
  </Suspense>
));

export const IntegrationLayerDiagram: DiagramComponent = memo((props) => (
  <Suspense fallback={<DiagramFallback />}>
    <LazyIntegrationLayerDiagram {...props} />
  </Suspense>
));

export const CostAnalysisDiagram: DiagramComponent = memo((props) => (
  <Suspense fallback={<DiagramFallback />}>
    <LazyCostAnalysisDiagram {...props} />
  </Suspense>
));

export const GPUInferenceDiagram: DiagramComponent = memo((props) => (
  <Suspense fallback={<DiagramFallback />}>
    <LazyGPUInferenceDiagram {...props} />
  </Suspense>
));

export const NOCDashboard: DiagramComponent = memo((props) => (
  <Suspense fallback={<DiagramFallback />}>
    <LazyNOCDashboard {...props} />
  </Suspense>
));

/** Utility exports for consistent UI patterns */
export { Tooltip } from './ui/Library';
