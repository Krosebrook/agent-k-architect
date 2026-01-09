

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Code, 
  Database, 
  Cpu, 
  Settings, 
  TrendingUp, 
  ShoppingBag, 
  MessageSquare 
} from 'lucide-react';
import { 
  HubNode, 
  DataFlowPacket, 
  CostTier, 
  AuthorProfile, 
  SectionContent,
  RoadmapStep
} from '../types';

export const APP_CONFIG = {
  appName: "FLASHFUSION",
  year: "2025",
  paperLink: "infrastructure",
  repoLink: "hero",
  documentationLink: "introduction",
} as const;

export const ROADMAP_STEPS: readonly RoadmapStep[] = [
  { 
    quarter: "Q1-25", 
    category: "Core", 
    title: "Orchestration Backbone", 
    desc: "Deployment of n8n as the primary high-concurrency relay for cross-enclave events.", 
    complexity: "High",
    link: "https://n8n.io/blog/n8n-release-v1/" 
  },
  { 
    quarter: "Q1-25", 
    category: "Connectivity", 
    title: "Granular RLS Matrix", 
    desc: "Validation of multi-tenant isolation through advanced Row-Level Security protocols.", 
    complexity: "Medium",
    link: "https://supabase.com/docs/guides/auth/row-level-security" 
  },
  { 
    quarter: "Q2-25", 
    category: "Intelligence", 
    title: "MCP Context Bridge", 
    desc: "Integration of Model Context Protocol for secure tool-access by autonomous agents.", 
    complexity: "High",
    link: "https://modelcontextprotocol.io/" 
  },
  { 
    quarter: "Q3-25", 
    category: "UX", 
    title: "Fabric Observability", 
    desc: "Deployment of real-time telemetry dashboards for all 7 functional enclaves.", 
    complexity: "Medium",
    link: "https://grafana.com/docs/grafana/latest/dashboards/" 
  },
  { 
    quarter: "Q4-25", 
    category: "Connectivity", 
    title: "Secondary Relay Logic", 
    desc: "Establishing redundant data paths through Zapier and Make for 99.99% uptime.", 
    complexity: "Low",
    link: "https://zapier.com/apps/n8n/integrations" 
  }
];

export const SECTIONS: Record<string, SectionContent> = {
  hero: {
    id: "hero",
    tagline: "Neural Compute Fabric • 2025",
    title: "FlashFusion",
    subtitle: "Federated Orchestration",
    description: "7 specialized enclaves. 50+ integrated modules. 3 synchrony protocols. Engineered for hyper-efficient data relay and isolation."
  },
  introduction: {
    id: "introduction",
    tagline: "System Architecture",
    title: "Enclaves & Synchrony",
    description_p1: "FlashFusion operates as a neural compute fabric, prioritizing centralized orchestration over fragmented point-to-point connections.",
    description_p2: "This 7-enclave architecture reduces integration complexity by routing all state changes through a high-performance sync layer (n8n, MCP), ensuring absolute visibility."
  },
  infrastructure: {
    id: "infrastructure",
    tagline: "Domain Topology",
    title: "The Functional Enclaves",
    description: "A granular breakdown of the specialized computational domains that form the federated FlashFusion stack."
  },
  integration: {
    id: "integration",
    tagline: "Sync Protocols",
    title: "Core, Relay & Burst Logic",
    description: "n8n (Primary), Zapier (Secondary), and MCP (Agent-Bridge) facilitate seamless data propagation across the fabric."
  },
  simulation: {
    id: "simulation",
    tagline: "Stress Lab",
    title: "The Sandbox",
    description: "Analyze the resilience of the federated enclaves by simulating node isolation and packet loss."
  },
  investment: {
    id: "investment",
    tagline: "Resource Efficiency",
    title: "Elastic Optimization",
    description: "By leveraging RLS for tenant isolation and centralized orchestration, we eliminate per-module licensing bloat."
  },
  roadmap: {
    id: "roadmap",
    tagline: "Expansion Roadmap",
    title: "Fabric Scaling Strategy",
    steps: ROADMAP_STEPS
  },
  governance: {
    id: "governance",
    tagline: "Governance",
    title: "Architectural Board",
    description: "Ensuring the continuous integrity and security of the federated infrastructure."
  }
};

export const HUBS_DATA: HubNode[] = [
  { 
    id: 'DEV', 
    label: 'App Enclave', 
    icon: Code, 
    color: 'bg-indigo-600', 
    desc: 'The engineering domain. Next.js 15, TypeScript, tRPC, and Drizzle ORM layer.',
    connections: ['DATA', 'OPS'],
    portalPath: '#infrastructure',
    subPlatforms: [
      { name: 'Next.js 15', role: 'Compute Runtime', url: 'https://nextjs.org/docs' },
      { name: 'tRPC', role: 'Type-Safe Protocol', url: 'https://trpc.io/docs' },
      { name: 'Drizzle', role: 'Persistence Logic', url: 'https://orm.drizzle.team/docs/overview' },
      { name: 'Vercel', role: 'Edge Deployment', url: 'https://vercel.com/docs' }
    ]
  },
  { 
    id: 'DATA', 
    label: 'Data Enclave', 
    icon: Database, 
    color: 'bg-blue-600', 
    desc: 'State & Persistence. Supabase PostgreSQL, RLS matrices, and Identity.',
    connections: ['DEV', 'AI', 'GROWTH'],
    portalPath: '#infrastructure',
    subPlatforms: [
      { name: 'Supabase', role: 'State Engine', url: 'https://supabase.com/docs' },
      { name: 'Postgres RLS', role: 'Domain Isolation', url: 'https://supabase.com/docs/guides/auth/row-level-security' },
      { name: 'Auth Node', role: 'Identity Provider', url: 'https://supabase.com/docs/guides/auth' },
      { name: 'Walrus', role: 'Decentralized Storage', url: 'https://walrus.xyz/' }
    ]
  },
  { 
    id: 'AI', 
    label: 'Inference Enclave', 
    icon: Cpu, 
    color: 'bg-emerald-600', 
    desc: 'Multi-Model Inference. Routing matrix for Claude, OpenAI, and Gemini on H100s.',
    connections: ['DATA', 'DEV', 'COLLAB'],
    portalPath: '#simulation',
    subPlatforms: [
      { name: 'H100 Tensor', role: 'Inference Cluster', url: 'https://www.nvidia.com/en-us/data-center/h100/' },
      { name: 'Claude 4.5', role: 'Reasoning Engine', url: 'https://www.anthropic.com/claude' },
      { name: 'GPT-4o', role: 'Creative Engine', url: 'https://openai.com/index/gpt-4o/' },
      { name: 'MCP Bridge', role: 'External Context', url: 'https://modelcontextprotocol.io/' }
    ]
  },
  { 
    id: 'OPS', 
    label: 'Ops Enclave', 
    icon: Settings, 
    color: 'bg-rose-600', 
    desc: 'Monitoring & Telemetry. Sentry, PostHog, and Prometheus clusters.',
    connections: ['DEV', 'DATA'],
    portalPath: '#infrastructure',
    subPlatforms: [
      { name: 'Sentry', role: 'Fault Detection', url: 'https://docs.sentry.io/' },
      { name: 'PostHog', role: 'Signal Analytics', url: 'https://posthog.com/docs' },
      { name: 'Grafana', role: 'NOC Telemetry', url: 'https://grafana.com/docs/' },
      { name: 'Docker', role: 'Virtualization', url: 'https://docs.docker.com/' }
    ]
  },
  { 
    id: 'GROWTH', 
    label: 'Revenue Enclave', 
    icon: TrendingUp, 
    color: 'bg-amber-600', 
    desc: 'Engagement & Lifecycle. HubSpot CRM and media optimization nodes.',
    connections: ['COMMERCE', 'DATA'],
    portalPath: '#infrastructure',
    subPlatforms: [
      { name: 'HubSpot', role: 'Lifecycle CRM', url: 'https://developers.hubspot.com/docs/api/overview' },
      { name: 'Cloudinary', role: 'Media Pipeline', url: 'https://cloudinary.com/documentation' },
      { name: 'Apollo Node', role: 'Signal Outreach', url: 'https://apolloio.github.io/apollo-api-docs/' },
      { name: 'Intercom', role: 'Engagement Sync', url: 'https://developers.intercom.com/' }
    ]
  },
  { 
    id: 'COMMERCE', 
    label: 'Commerce Enclave', 
    icon: ShoppingBag, 
    color: 'bg-violet-600', 
    desc: 'Transactional Logic. Stripe and automated fulfillment relays.',
    connections: ['GROWTH', 'DATA', 'OPS'],
    portalPath: '#investment',
    subPlatforms: [
      { name: 'Stripe', role: 'Payment Gateway', url: 'https://docs.stripe.com/api' },
      { name: 'Printify Relay', role: 'Fulfillment Logic', url: 'https://developers.printify.com/' },
      { name: 'Shopify Sync', role: 'Storefront Protocol', url: 'https://shopify.dev/docs/api/admin-rest' },
      { name: 'Compliance Node', role: 'Tax Logic', url: 'https://docs.stripe.com/tax' }
    ]
  },
  { 
    id: 'COLLAB', 
    label: 'Coordination Enclave', 
    icon: MessageSquare, 
    color: 'bg-teal-600', 
    desc: 'Synchronous Workspace. Slack, Notion, and Linear integration.',
    connections: ['DEV', 'AI', 'GROWTH'],
    portalPath: '#infrastructure',
    subPlatforms: [
      { name: 'Slack', role: 'Fabric Messaging', url: 'https://api.slack.com/' },
      { name: 'Notion', role: 'Distributed Knowledge', url: 'https://developers.notion.com/' },
      { name: 'Linear', role: 'Issue Propagation', url: 'https://developers.linear.app/' },
      { name: 'Figma', role: 'Design Canvas', url: 'https://www.figma.com/developers/api' }
    ]
  }
];

export const FLOW_PACKETS: DataFlowPacket[] = [
  { id: "enclave-sync", label: "Protocol Sync", desc: "Supabase Event → n8n Core → Domain Handshake", detailUrl: "#integration" },
  { id: "revenue-trigger", label: "Transaction Relay", desc: "Stripe Webhook → Relay Hub → CRM State Update", detailUrl: "#integration" },
  { id: "ai-inference-call", label: "Neural Tool Call", desc: "Claude → MCP Bridge → Domain Context Access", detailUrl: "#integration" }
];

export const COST_TIERS: CostTier[] = [
  { id: 1, label: "Core Sync Layer", cost: 40, color: "bg-fusion-bolt", desc: "n8n, Zapier, MCP Bridge", auditUrl: "#investment" },
  { id: 2, label: "State Persistence", cost: 25, color: "bg-blue-600", desc: "Supabase Enterprise Clusters", auditUrl: "#investment" },
  { id: 3, label: "Inference Compute", cost: 1200, color: "bg-emerald-600", desc: "NVIDIA H100 Reserved Logic", auditUrl: "#investment" },
  { id: 4, label: "Transactional Fees", cost: 580, color: "bg-violet-600", desc: "Stripe Volume & COGS", auditUrl: "#investment" },
  { id: 5, label: "Workspace Access", cost: 69, color: "bg-teal-600", desc: "Linear, Notion, Slack seats", auditUrl: "#investment" },
];

export const GOVERNANCE_ROLES: AuthorProfile[] = [
  { 
    name: 'Principal Architect', 
    role: 'Executive Orchestration', 
    bio: 'Pioneering federated compute fabrics since 2018.',
    socials: { linkedin: '#', github: '#' }
  },
  { 
    name: 'Systems Engineer', 
    role: 'Infrastructure Lead', 
    bio: 'Specialist in 99.9% efficient federated state machines.',
    socials: { github: '#' }
  },
  { 
    name: 'Integration Lead', 
    role: 'Sync Logic Director', 
    bio: 'Master of high-performance n8n orchestration logic.',
    socials: { linkedin: '#' }
  },
  { 
    name: 'Security Auditor', 
    role: 'Compliance & RLS Lead', 
    bio: 'Securing 500k+ monthly data packets via RLS matrices.',
    socials: { linkedin: '#' }
  }
];