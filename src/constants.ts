
import { Blueprint } from './types';

export const TOP_50_BLUEPRINTS: Blueprint[] = [
  // AIaaS New Tiers (1-5)
  { id: 'aiaas-1', title: 'Enterprise LLM Gateway', tech: 'FastAPI + Redis + Stripe', icon: 'fa-cloud-arrow-up', category: 'AIaaS', intent: 'High-availability LLM proxy with multi-tenant billing.' },
  { id: 'aiaas-2', title: 'Vision-as-a-Service', tech: 'NestJS + AWS Panorama + Supabase', icon: 'fa-eye', category: 'AIaaS', intent: 'Tiered computer vision API for surveillance apps.' },
  { id: 'aiaas-3', title: 'Semantic Search Engine', tech: 'Go + Pinecone + Cohere', icon: 'fa-magnifying-glass', category: 'AIaaS', intent: 'Vector-first search API as a standalone service.' },
  { id: 'aiaas-4', title: 'Agent-as-a-Platform', tech: 'LangGraph + Docker + Next.js', icon: 'fa-robot', category: 'AIaaS', intent: 'Dynamic agent deployment for third-party developers.' },
  { id: 'aiaas-5', title: 'Data Extraction Utility', tech: 'Python + Unstructured + Gemini', icon: 'fa-file-export', category: 'AIaaS', intent: 'Document parsing API with usage-based metering.' },

  // SaaS (6-15)
  { id: 'saas-1', title: 'Multitenant B2B SaaS', tech: 'Next.js + Supabase + Stripe', icon: 'fa-building-shield', category: 'SaaS', intent: 'Enterprise-grade billing and RBAC.' },
  { id: 'saas-2', title: 'White-label CMS Hub', tech: 'Remix + Payload + PlanetScale', icon: 'fa-sitemap', category: 'SaaS', intent: 'High-performance headless CMS.' },
  { id: 'saas-3', title: 'CRM Orchestrator', tech: 'NestJS + PostgreSQL + Redis', icon: 'fa-address-card', category: 'SaaS', intent: 'Complex third-party data syncing.' },
  { id: 'saas-4', title: 'HRIS Talent Portal', tech: 'SvelteKit + Prisma + AWS', icon: 'fa-users-gear', category: 'SaaS', intent: 'Employee lifecycle management.' },
  { id: 'saas-5', title: 'LMS Knowledge Base', tech: 'Next.js + Mux + Sanity', icon: 'fa-graduation-cap', category: 'SaaS', intent: 'Video-first learning platform.' },
  
  // AI (16-25)
  { id: 'ai-1', title: 'Agentic Workflow Hub', tech: 'LangGraph + Pinecone + Claude', icon: 'fa-robot', category: 'AI', intent: 'Multi-agent reasoning loops.' },
  { id: 'ai-2', title: 'Privacy RAG Pipeline', tech: 'Ollama + ChromaDB + Python', icon: 'fa-brain-circuit', category: 'AI', intent: 'Local-first secure document Q&A.' },
  { id: 'ai-3', title: 'LLM Routing Proxy', tech: 'Go + Gemini + OpenAI + Redis', icon: 'fa-route', category: 'AI', intent: 'Smart cost/latency load balancing.' },
  
  // Fintech (26-35)
  { id: 'fin-1', title: 'Double-Entry Ledger', tech: 'Rust + PostgreSQL + Vault', icon: 'fa-money-bill-transfer', category: 'Fintech', intent: 'Immutable financial tracking.' },
  { id: 'fin-2', title: 'Fraud Detection Mesh', tech: 'Flink + Scikit + Redis', icon: 'fa-shield-halved', category: 'Fintech', intent: 'Real-time transaction scoring.' },

  // Edge (36-40)
  { id: 'edge-1', title: 'Global Proxy Cache', tech: 'Cloudflare Workers + D1', icon: 'fa-globe', category: 'Edge', intent: 'Sub-10ms global delivery.' },

  // DevOps (41-50)
  { id: 'dev-1', title: 'GitOps K8s Cluster', tech: 'ArgoCD + Terraform + EKS', icon: 'fa-cloud-arrow-up', category: 'DevOps', intent: 'Declarative cluster management.' },
  { id: 'dev-2', title: 'Internal Dev Portal', tech: 'Backstage + GitHub Actions', icon: 'fa-id-card-clip', category: 'DevOps', intent: 'Engineering self-service platform.' }
  // (Full Top 50 list populated via categories in UI)
];
