
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { HUBS_DATA } from '../data/content';
import { InferenceMetrics } from '../types';

/**
 * Federated Routing Configuration
 * Maps architectural tiers to specific model providers (Anthropic, OpenAI, Google).
 */
interface ModelRoute {
  id: string;
  provider: string;
  label: string;
  costPer1k: number;
  backingModel: string;
  latencyBase: number;
}

const ROUTING_MATRIX = {
  ACCELERATED: {
    REASONING: { 
      id: 'claude-3-5-sonnet', 
      provider: 'Anthropic', 
      label: 'Claude 3.5 Sonnet', 
      costPer1k: 0.015,
      backingModel: 'gemini-3-pro-preview',
      latencyBase: 850
    },
    CREATIVE: { 
      id: 'gpt-4o', 
      provider: 'OpenAI', 
      label: 'GPT-4o', 
      costPer1k: 0.010,
      backingModel: 'gemini-3-pro-preview',
      latencyBase: 720
    }
  },
  EDGE: {
    FAST: { 
      id: 'gemini-flash', 
      provider: 'Google', 
      label: 'Gemini 3 Flash', 
      costPer1k: 0.0001,
      backingModel: 'gemini-3-flash-preview',
      latencyBase: 120
    },
    FALLBACK: { 
      id: 'gpt-4o-mini', 
      provider: 'OpenAI', 
      label: 'GPT-4o Mini', 
      costPer1k: 0.0001,
      backingModel: 'gemini-3-flash-preview',
      latencyBase: 140
    }
  }
} as const;

/**
 * LRU Cache Implementation for Inference
 */
class InferenceCache {
  private cache = new Map<string, { result: InferenceResult; expiry: number }>();
  private readonly ttl: number;
  private readonly maxSize: number;

  constructor(ttlMinutes: number = 15, maxSize: number = 100) {
    this.ttl = 1000 * 60 * ttlMinutes;
    this.maxSize = maxSize;
  }

  get(key: string): InferenceResult | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    return entry.result;
  }

  set(key: string, result: InferenceResult): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    
    this.cache.set(key, { 
      result, 
      expiry: Date.now() + this.ttl 
    });
  }
}

const CACHE = new InferenceCache(20, 50);

/**
 * Connection Optimizer
 */
class ConnectionOptimizer {
  private activeConnections = new Map<string, number>();

  keepAlive(routeId: string) {
    this.activeConnections.set(routeId, Date.now());
  }

  getLatencyOverhead(routeId: string): number {
    const lastActive = this.activeConnections.get(routeId);
    if (!lastActive) return 400; 
    
    const idleTime = Date.now() - lastActive;
    if (idleTime > 60000) return 250; 
    
    return 15; 
  }
}

const CONNECTION_POOL = new ConnectionOptimizer();

/**
 * System Instruction Factory
 */
const GET_ROUTING_PROMPT = (route: ModelRoute, tflops: number) => `
You are the FlashFusion Orchestrator, running on the ${route.label} node.
Provider: ${route.provider}.
Cluster Capacity: ${tflops.toFixed(1)} TFLOPS (H100 Tensor Core).

MISSION:
- Manage the federated architecture comprising: ${HUBS_DATA.map(h => h.id).join(', ')}.
- Route intelligence between domains.
- Maintain the persona of a high-end systems architect.

CAPABILITIES:
1. 'navigateToSection': Move viewport to sectors.
2. 'triggerSimulationEvent': Chaos engineering protocols.
3. 'toggleGPU': Scale inference cluster.
4. 'createMaintenanceTask': Add a persistent task to the system backlog for maintenance.
`;

const TOOL_MANIFEST: FunctionDeclaration[] = [
  {
    name: 'navigateToSection',
    parameters: {
      type: Type.OBJECT,
      description: 'Navigates the user interface to a specific architectural district.',
      properties: {
        sectionId: { type: Type.STRING },
      },
      required: ['sectionId'],
    },
  },
  {
    name: 'triggerSimulationEvent',
    parameters: {
      type: Type.OBJECT,
      description: 'Executes a failure simulation or connectivity test.',
      properties: {
        eventType: { type: Type.STRING, enum: ['FAIL_DISTRICT', 'SWITCH_TRANSIT', 'RESET'] },
        targetId: { type: Type.STRING }
      },
      required: ['eventType'],
    },
  },
  {
    name: 'toggleGPU',
    parameters: {
      type: Type.OBJECT,
      description: 'Activates or scales back the H100 GPU acceleration cluster.',
      properties: {
        active: { type: Type.BOOLEAN }
      },
      required: ['active'],
    }
  },
  {
    name: 'createMaintenanceTask',
    parameters: {
      type: Type.OBJECT,
      description: 'Adds a maintenance task to the persistent system backlog.',
      properties: {
        text: { type: Type.STRING, description: 'The description of the maintenance task.' }
      },
      required: ['text'],
    }
  }
];

export interface InferenceResult {
  text: string;
  metrics: InferenceMetrics;
  functionCalls?: any[];
  cost: number;
  modelUsed: string;
}

export const InferenceGateway = {
  async chat(message: string, isBoosted: boolean = false, tflops: number = 120): Promise<InferenceResult> {
    const startTime = Date.now();
    const complexity = message.length > 60 || message.toLowerCase().includes('analyze') ? 'COMPLEX' : 'SIMPLE';
    
    let route: ModelRoute;
    if (isBoosted) {
      route = complexity === 'COMPLEX' ? ROUTING_MATRIX.ACCELERATED.REASONING : ROUTING_MATRIX.ACCELERATED.CREATIVE;
    } else {
      route = ROUTING_MATRIX.EDGE.FAST;
    }

    const cacheKey = `${route.id}:${message.trim().toLowerCase()}`;
    const cachedResult = CACHE.get(cacheKey);
    if (cachedResult) {
      CONNECTION_POOL.keepAlive(route.id);
      return {
        ...cachedResult,
        metrics: {
          ...cachedResult.metrics,
          cached: true,
          totalLatency: 15,
          ttft: 5
        }
      };
    }

    try {
      const overhead = CONNECTION_POOL.getLatencyOverhead(route.id);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: route.backingModel,
        contents: [{ role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: GET_ROUTING_PROMPT(route, tflops),
          tools: [{ functionDeclarations: TOOL_MANIFEST }],
          temperature: isBoosted ? 0.7 : 0.3,
          thinkingConfig: isBoosted ? { thinkingBudget: 16384 } : { thinkingBudget: 0 },
        },
      });

      const responseText = response.text || "Orchestration Fault: Empty response.";
      const processingTime = (Date.now() - startTime) + overhead;
      
      const inputTokens = message.length / 4;
      const outputTokens = responseText.length / 4;
      const totalCost = ((inputTokens + outputTokens) / 1000) * route.costPer1k;

      const result: InferenceResult = {
        text: responseText,
        functionCalls: response.functionCalls,
        metrics: {
          ttft: Math.max(20, processingTime * 0.15),
          totalLatency: processingTime,
          cached: false,
          accelerated: isBoosted,
          provider: route.provider,
          cluster: isBoosted ? 'H100-DGX-CLUSTER' : 'EDGE-TPU-NODE',
          throughput: tflops
        },
        cost: totalCost,
        modelUsed: route.label
      };

      CACHE.set(cacheKey, result);
      CONNECTION_POOL.keepAlive(route.id);

      return result;

    } catch (error) {
      console.error("[FFAI] Routing Error:", error);
      return {
        text: "The federated gateway is experiencing upstream latency. Rerouting packet...",
        metrics: {
          ttft: 0,
          totalLatency: 0,
          cached: false,
          accelerated: false,
          provider: 'System',
          cluster: 'Local Fallback',
          throughput: 0
        },
        cost: 0,
        modelUsed: 'Fallback'
      };
    }
  }
};
