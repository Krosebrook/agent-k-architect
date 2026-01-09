
export enum ModelProvider {
  GEMINI = 'GEMINI',
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
  GROQ = 'GROQ',
  OLLAMA = 'OLLAMA'
}

export interface UserProfile {
  name: string;
  role: string;
  avatar?: string;
  // Removed apiKeys to comply with security guidelines
  preferences: {
    theme: 'dark' | 'light';
    autoGrounding: boolean;
    terminalStyle: 'vintage' | 'modern';
    securityStrictness: 'LOW' | 'MEDIUM' | 'HIGH';
    defaultProvider: ModelProvider;
  };
}

export interface TechStack {
  framework: string;
  architecture: string;
  infrastructure: string[];
  intelligence: string[];
  deployment: string;
  repository: string;
  documentation: string;
  codeStyle: string;
  stateManagement: string;
  dataConsistency: string;
  errorPattern: string;
}

export interface AIaaSSpec {
  tiers: { name: string; rpm: number; tpd: number; pricing: string }[];
  metering: string;
  gateway: string;
  fallbackStrategy: string;
}

export interface Manifest {
  title: string;
  summary: string;
  aiaas?: AIaaSSpec;
  orchestration: {
    logic: string;
    diagram: string;
    wiring: string;
    repoStructure: string;
    cicdPipeline: string;
  };
  scaffold: {
    path: string;
    content: string;
    language: string;
  }[];
  documentation: {
    guardrails: string[];
    constraints: string[];
    edgeCases: string[];
    standard: string;
    openapiSpec?: string;
  };
}

export interface Blueprint {
  id: string;
  title: string;
  tech: string;
  icon: string;
  intent: string;
  category: 'SaaS' | 'AI' | 'Fintech' | 'Edge' | 'Data' | 'Security' | 'DevOps' | 'Web3' | 'Enterprise' | 'AIaaS';
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  content: string;
  action: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'PATCH_PENDING';
  deliverables?: {
    repoPr?: string;
    pipelineUrl?: string;
    logsUrl?: string;
    troubleshootTerminal?: boolean;
    documentationLink?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  groundingLinks?: { title: string; uri: string }[];
  isApiResult?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
}
