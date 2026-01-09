
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { ModelProvider } from '../types';
import { 
  ChartBar, 
  Microchip, 
  Zap, 
  Brain, 
  PlusSquare, 
  CircleCheck, 
  Search, 
  Code, 
  Image as ImageIcon, 
  FileText, 
  Database, 
  Lock, 
  Trash2, 
  Power,
  ChevronRight,
  ShieldCheck,
  Link,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { blink } from '../lib/blink';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface CustomRoutingRule {
  id: string;
  name: string;
  provider: ModelProvider | string;
  costThreshold: number;
  latencyLimit: number;
  active: boolean;
  tools: string[];
}

interface ProviderDetails {
  endpoint: string;
  version: string;
  keyConfig: string;
  description: string;
  health: 'STABLE' | 'DEGRADED' | 'MAINTENANCE';
  icon: any;
  nativeTools: string[];
}

const AVAILABLE_TOOLS = [
  { id: 'web_search', label: 'Web Search', icon: Search, description: 'Real-time grounding via Google Search for up-to-date facts.' },
  { id: 'code_interpreter', label: 'Code Interpreter', icon: Code, description: 'Sandboxed Python execution for complex math and data visualization.' },
  { id: 'image_gen', label: 'Image Generation', icon: ImageIcon, description: 'Native image synthesis using Gemini 2.5 Flash / 3 Pro models.' },
  { id: 'file_analysis', label: 'File Analysis', icon: FileText, description: 'High-fidelity extraction and analysis from PDF, CSV, and Doc formats.' },
  { id: 'db_access', label: 'Database Access', icon: Database, description: 'Direct secure R/W access to primary Supabase PostgreSQL nodes.' }
];

const providerMetadata: Record<string, ProviderDetails> = {
  [ModelProvider.GEMINI]: {
    endpoint: 'generativelanguage.googleapis.com/v1beta',
    version: 'Gemini 3 Pro / Flash Preview',
    keyConfig: 'API_KEY',
    description: 'Native multimodal reasoning with Google Search grounding support. Optimized for complex architectural synthesis.',
    health: 'STABLE',
    icon: Brain,
    nativeTools: ['web_search', 'image_gen', 'file_analysis']
  },
  [ModelProvider.OPENAI]: {
    endpoint: 'api.openai.com/v1/chat/completions',
    version: 'GPT-4o (Stable Release)',
    keyConfig: 'OPENAI_API_KEY',
    description: 'Industry standard reasoning with high-throughput JSON modes and robust function calling capabilities.',
    health: 'STABLE',
    icon: Microchip,
    nativeTools: ['code_interpreter', 'image_gen']
  },
  [ModelProvider.ANTHROPIC]: {
    endpoint: 'api.anthropic.com/v1/messages',
    version: 'Claude 3.5 Sonnet',
    keyConfig: 'ANTHROPIC_API_KEY',
    description: 'High-fidelity coding and structured analysis with native artifact support and human-centric reasoning.',
    health: 'STABLE',
    icon: Zap,
    nativeTools: ['file_analysis', 'code_interpreter']
  },
  [ModelProvider.GROQ]: {
    endpoint: 'api.groq.com/openai/v1',
    version: 'Llama 3 70B (Fast Inference)',
    keyConfig: 'GROQ_API_KEY',
    description: 'Ultra-low latency inference engine designed for high-concurrency real-time conversational agents.',
    health: 'STABLE',
    icon: Zap,
    nativeTools: ['web_search']
  },
  [ModelProvider.OLLAMA]: {
    endpoint: 'localhost:11434/api',
    version: 'Local Instance (Self-Hosted)',
    keyConfig: 'N/A (Local Auth)',
    description: 'On-premise execution environment for maximum data sovereignty, zero cost, and air-gapped security.',
    health: 'STABLE',
    icon: Database,
    nativeTools: ['db_access']
  }
};

const initialChartData = [
  { name: 'Gemini 3 Flash', latency: 85, cost: 0.1 },
  { name: 'Gemini 3 Pro', latency: 420, cost: 1.2 },
  { name: 'Claude 3.5 Sonnet', latency: 310, cost: 0.8 },
  { name: 'GPT-4o', latency: 280, cost: 2.5 },
];

export const ModelRouter: React.FC = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState<CustomRoutingRule[]>([]);
  const [hoveredRegistryProviderId, setHoveredRegistryProviderId] = useState<string | null>(null);
  const [hoveredRegistryToolsId, setHoveredRegistryToolsId] = useState<string | null>(null);
  const [hoveredFormProvider, setHoveredFormProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [newRule, setNewRule] = useState<Partial<CustomRoutingRule>>({
    name: '',
    provider: ModelProvider.GEMINI,
    costThreshold: 0.5,
    latencyLimit: 500,
    active: true,
    tools: []
  });

  useEffect(() => {
    if (!user) return;
    
    const fetchRules = async () => {
      try {
        const result = await blink.db.routing_rules.list({
          where: { user_id: user.id }
        });
        setRules(result.map((r: any) => ({
          id: r.id,
          name: r.name,
          provider: r.provider,
          costThreshold: r.cost_threshold,
          latencyLimit: r.latency_limit,
          active: Number(r.active) === 1,
          tools: JSON.parse(r.tools || '[]')
        })));
      } catch (e) {
        console.error("Failed to fetch routing rules", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, [user]);

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name || !user) return;

    const ruleId = crypto.randomUUID();
    const rule: CustomRoutingRule = {
      id: ruleId,
      name: newRule.name as string,
      provider: newRule.provider as string,
      costThreshold: Number(newRule.costThreshold),
      latencyLimit: Number(newRule.latencyLimit),
      active: newRule.active ?? true,
      tools: newRule.tools || []
    };

    try {
      await blink.db.routing_rules.create({
        id: ruleId,
        user_id: user.id,
        name: rule.name,
        provider: rule.provider,
        cost_threshold: rule.costThreshold,
        latency_limit: rule.latencyLimit,
        active: rule.active ? 1 : 0,
        tools: JSON.stringify(rule.tools)
      });

      setRules(prev => [...prev, rule]);
      setNewRule({
        name: '',
        provider: ModelProvider.GEMINI,
        costThreshold: 0.5,
        latencyLimit: 500,
        active: true,
        tools: []
      });
      toast.success('Routing rule committed');
    } catch (e) {
      console.error('Error creating rule:', e);
      toast.error('Failed to commit rule');
    }
  };

  const toggleTool = (toolId: string) => {
    setNewRule(prev => {
      const currentTools = prev.tools || [];
      return {
        ...prev,
        tools: currentTools.includes(toolId) 
          ? currentTools.filter(id => id !== toolId) 
          : [...currentTools, toolId]
      };
    });
  };

  const toggleRule = async (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (!rule || !user) return;

    const newActive = !rule.active;
    try {
      await blink.db.routing_rules.update({
        where: { id, user_id: user.id },
        data: { active: newActive ? 1 : 0 }
      });
      setRules(rules.map(r => r.id === id ? { ...r, active: newActive } : r));
    } catch (e) {
      toast.error('Failed to update rule');
    }
  };

  const deleteRule = async (id: string) => {
    if (!user) return;
    try {
      await blink.db.routing_rules.delete({
        where: { id, user_id: user.id }
      });
      setRules(rules.filter(r => r.id !== id));
      toast.success('Rule decommissioned');
    } catch (e) {
      toast.error('Failed to delete rule');
    }
  };

  const getProviderInfo = (provider: string) => {
    return providerMetadata[provider] || {
      endpoint: 'UNKNOWN_GATEWAY',
      version: 'N/A',
      keyConfig: 'N/A',
      description: 'Generic provider configuration.',
      health: 'MAINTENANCE' as const,
      icon: Info,
      nativeTools: []
    };
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondary/30 border border-border rounded-3xl p-6 shadow-xl relative overflow-hidden group backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h3 className="font-black text-foreground uppercase tracking-tight italic">Performance Observability</h3>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">Node Latency Metrics (ms)</p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={initialChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={9} tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={9} tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold', fontSize: '10px' }}
                  cursor={{ fill: 'hsl(var(--primary) / 0.05)' }}
                />
                <Bar dataKey="latency" radius={[6, 6, 0, 0]} barSize={40}>
                  {initialChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.latency > 350 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-secondary/30 border border-border rounded-3xl p-6 shadow-xl relative group overflow-hidden backdrop-blur-sm">
           <div className="mb-6 relative z-10">
              <h3 className="font-black text-foreground uppercase tracking-tight italic">System Heuristics</h3>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">Autonomous Routing Logic</p>
           </div>
           
           <div className="space-y-4 relative z-10">
              <div className="p-4 bg-background/50 border border-border rounded-2xl flex items-center justify-between group/item hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-foreground uppercase tracking-wider">Low Latency Mode</h4>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">Auto-switch to Flash nodes</p>
                  </div>
                </div>
                <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer shadow-[0_0_15px_hsl(var(--primary)/0.4)]">
                   <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="p-4 bg-background/50 border border-border rounded-2xl flex items-center justify-between group/item hover:border-accent/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent border border-accent/20 shadow-inner">
                    <Brain size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-foreground uppercase tracking-wider">Deep Reasoning</h4>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">Tiered Architectural Synthesis</p>
                  </div>
                </div>
                <div className="w-10 h-5 bg-muted rounded-full relative cursor-pointer">
                   <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="flex items-center justify-between text-[10px] mb-2 px-1">
                  <span className="text-muted-foreground font-black uppercase tracking-widest">Router Utilization</span>
                  <span className="text-primary font-bold font-mono">76.8% Load</span>
                </div>
                <div className="w-full h-2.5 bg-background rounded-full overflow-hidden border border-border p-0.5 shadow-inner">
                   <div className="w-[76%] h-full bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.6)] animate-pulse"></div>
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-secondary/30 border border-border rounded-3xl p-6 shadow-xl relative h-fit backdrop-blur-sm">
          <h3 className="font-black text-foreground uppercase tracking-tight italic mb-6 flex items-center gap-2">
            <PlusSquare className="text-primary" size={20} />
            Commit Routing Directive
          </h3>
          <form onSubmit={handleAddRule} className="space-y-5">
            <div>
              <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1 italic">Directive Name</label>
              <input 
                type="text" 
                value={newRule.name}
                onChange={e => setNewRule({...newRule, name: e.target.value})}
                placeholder="e.g. BALANCER_v2"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono transition-all shadow-inner"
              />
            </div>

            <div className="relative">
              <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1 italic">Provider Logic</label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(ModelProvider).map(provider => {
                  const pInfo = getProviderInfo(provider);
                  const isSelected = newRule.provider === provider;
                  const Icon = pInfo.icon;
                  return (
                    <div 
                      key={provider}
                      className="relative"
                      onMouseEnter={() => setHoveredFormProvider(provider)}
                      onMouseLeave={() => setHoveredFormProvider(null)}
                    >
                      <button
                        type="button"
                        onClick={() => setNewRule({...newRule, provider: provider})}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all duration-300 group/provider-btn",
                          isSelected ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_hsl(var(--primary)/0.1)]" : "bg-background border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                        )}
                      >
                        <span className="flex items-center gap-4 flex-1">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                            isSelected ? "bg-primary text-primary-foreground shadow-lg" : "bg-secondary text-muted-foreground"
                          )}>
                            <Icon size={16} />
                          </div>
                          <div className="flex flex-col items-start gap-1">
                            <span className="leading-none">{provider}</span>
                          </div>
                        </span>
                        {isSelected && <CircleCheck className="text-primary" size={14} />}
                      </button>

                      {hoveredFormProvider === provider && (
                        <div className="absolute left-full ml-6 top-1/2 -translate-y-1/2 w-[320px] bg-background border border-primary/40 rounded-[2.5rem] p-8 shadow-2xl z-[500] backdrop-blur-3xl animate-in fade-in slide-in-from-left-4 duration-300 pointer-events-none border-l-4 border-l-primary overflow-hidden">
                           <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                  <Icon size={20} />
                                </div>
                                <div className="text-[11px] font-black text-primary uppercase font-mono tracking-[0.2em]">{provider}_SPEC</div>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                                <span className="text-[9px] font-black text-accent uppercase">{pInfo.health}</span>
                              </div>
                           </div>
                           
                           <div className="space-y-6">
                              <div className="p-4 bg-secondary/50 border border-border rounded-2xl shadow-inner">
                                <p className="text-[11px] text-muted-foreground italic leading-relaxed font-medium">
                                  {pInfo.description}
                                </p>
                              </div>
                              
                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                  <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest ml-1">Gateway Cluster</div>
                                  <div className="text-[10px] text-primary bg-background px-4 py-3 rounded-xl border border-border font-mono truncate font-bold shadow-inner">
                                    {pInfo.endpoint}
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-background p-4 rounded-2xl border border-border shadow-inner">
                                    <div className="text-[7px] text-muted-foreground uppercase mb-1.5 font-black">Stable Ver.</div>
                                    <div className="text-[10px] text-foreground font-black truncate italic">{pInfo.version}</div>
                                  </div>
                                  <div className="bg-background p-4 rounded-2xl border border-border shadow-inner">
                                    <div className="text-[7px] text-muted-foreground uppercase mb-1.5 font-black">Auth Integrity</div>
                                    <div className="text-[9px] text-accent font-black font-mono flex items-center gap-1">
                                      <Lock size={10} /> SECURED
                                    </div>
                                  </div>
                                </div>
                              </div>
                           </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1 italic">Binding Tools</label>
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {AVAILABLE_TOOLS.map(tool => {
                  const ToolIcon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => toggleTool(tool.id)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all duration-300 relative text-left group/tool-btn",
                        newRule.tools?.includes(tool.id) ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_hsl(var(--primary)/0.1)]" : "bg-background border-border text-muted-foreground hover:border-foreground/20 hover:bg-secondary/50"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 border shadow-inner",
                        newRule.tools?.includes(tool.id) ? "bg-primary text-primary-foreground border-primary-foreground/30 shadow-lg" : "bg-secondary text-muted-foreground border-border"
                      )}>
                        <ToolIcon size={16} />
                      </div>
                      <div className="flex-1 min-w-0 pr-10">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-tight group-hover/tool-btn:text-foreground transition-colors">
                            {tool.label}
                          </span>
                          <span className="text-[8px] text-muted-foreground font-medium italic group-hover/tool-btn:text-muted-foreground transition-colors truncate">
                            {tool.description}
                          </span>
                        </div>
                      </div>
                      {newRule.tools?.includes(tool.id) && <CircleCheck className="text-primary absolute right-5 top-1/2 -translate-y-1/2" size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-accent text-primary-foreground font-black text-[10px] tracking-widest uppercase py-4 rounded-2xl transition-all shadow-xl active:scale-95 group shadow-primary/20">
              <PlusSquare className="inline-block mr-2 group-hover:animate-pulse" size={16} /> Commit Rule
            </button>
          </form>
        </div>

        <div className="lg:col-span-8 bg-secondary/30 border border-border rounded-3xl p-6 shadow-xl relative flex flex-col h-fit backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8 relative z-10 shrink-0">
            <div>
              <h3 className="font-black text-foreground uppercase tracking-tight italic">Rule Registry</h3>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">{rules.length} Active Custom Directives</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black bg-background border border-border px-3 py-1 rounded-full text-accent uppercase border-accent/20">Router Active</span>
            </div>
          </div>
          
          <div className="space-y-4 min-h-[400px]">
            {loading ? (
               <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl text-muted-foreground bg-background/20 opacity-50 animate-pulse">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] uppercase tracking-widest font-black italic">Loading Registry...</p>
              </div>
            ) : rules.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl text-muted-foreground bg-background/20 opacity-50">
                <Power className="mb-4 text-primary opacity-20" size={40} />
                <p className="text-[10px] uppercase tracking-widest font-black italic">Awaiting Directives</p>
              </div>
            ) : (
              rules.map((rule) => {
                const pInfo = getProviderInfo(rule.provider);
                const ProviderIcon = pInfo.icon;
                return (
                  <div key={rule.id} className="bg-background/80 border border-border rounded-3xl p-5 flex items-center justify-between group hover:border-primary/40 transition-all shadow-lg relative overflow-visible">
                    <div className={cn(
                      "absolute top-0 left-0 w-1 h-full rounded-l-3xl transition-all duration-300",
                      rule.active ? "bg-primary shadow-[0_0_15px_hsl(var(--primary))]" : "bg-muted"
                    )}></div>
                    
                    <div className="flex items-center gap-6 flex-1 min-w-0 overflow-visible">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all shrink-0 border",
                        rule.active ? "bg-primary/10 text-primary border-primary/20 shadow-xl" : "bg-secondary text-muted-foreground border-border"
                      )}>
                        {rule.active ? <Zap size={24} /> : <Power size={24} />}
                      </div>
                      
                      <div className="flex-1 min-w-0 overflow-visible">
                        <div className="flex items-center gap-3 mb-2 overflow-visible">
                          <h4 className={cn(
                            "text-sm font-black uppercase tracking-tight truncate",
                            rule.active ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {rule.name}
                          </h4>
                          <div className="relative overflow-visible" onMouseEnter={() => setHoveredRegistryProviderId(rule.id)} onMouseLeave={() => setHoveredRegistryProviderId(null)}>
                            <span className={cn(
                              "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest cursor-help transition-all border flex items-center gap-2 whitespace-nowrap",
                              rule.active ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary text-muted-foreground border-border"
                            )}>
                              <ProviderIcon size={10} />
                              {rule.provider}
                            </span>
                            
                            {hoveredRegistryProviderId === rule.id && (
                              <div className="absolute bottom-full left-0 mb-4 w-[320px] bg-background border border-primary/30 rounded-[2.5rem] p-8 shadow-2xl z-[500] backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200 pointer-events-none border-l-4 border-l-primary origin-bottom-left overflow-hidden">
                                <div className="flex items-center justify-between border-b border-border pb-5 mb-6">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                      <ProviderIcon size={14} />
                                    </div>
                                    <span className="text-[10px] font-black text-primary uppercase font-mono tracking-[0.2em]">NODE_MANIFEST</span>
                                  </div>
                                  <div className="flex items-center gap-2 px-3 py-1 bg-accent/5 border border-accent/20 rounded-xl">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                                    <span className="text-[9px] font-bold text-accent uppercase">{pInfo.health}</span>
                                  </div>
                                </div>
                                <div className="space-y-6">
                                  <div className="p-4 bg-secondary/50 border border-border rounded-2xl shadow-inner">
                                    <p className="text-[11px] text-muted-foreground italic leading-relaxed font-medium">{pInfo.description}</p>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <div className="text-[8px] font-black text-muted-foreground uppercase mb-2 tracking-widest flex items-center gap-2">
                                        <Link size={10} className="text-primary/30" /> Gateway Endpoint
                                      </div>
                                      <div className="text-[10px] text-primary font-mono bg-background px-4 py-3 rounded-xl border border-border break-all leading-tight font-bold shadow-inner">{pInfo.endpoint}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="bg-background/40 p-4 rounded-2xl border border-border shadow-inner">
                                        <div className="text-[8px] text-muted-foreground uppercase mb-1.5 font-black">Release Tag</div>
                                        <div className="text-[11px] text-foreground font-black truncate uppercase italic tracking-tighter">{pInfo.version}</div>
                                      </div>
                                      <div className="bg-background/40 p-4 rounded-2xl border border-border shadow-inner">
                                        <div className="text-[8px] text-muted-foreground uppercase mb-1.5 font-black">Auth Mode</div>
                                        <div className="text-[9px] text-accent font-bold font-mono truncate flex items-center gap-1">SECURED</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="relative flex flex-wrap gap-1.5 cursor-help min-h-[1.5rem] overflow-visible" onMouseEnter={() => setHoveredRegistryToolsId(rule.id)} onMouseLeave={() => setHoveredRegistryToolsId(null)}>
                          {rule.tools && rule.tools.length > 0 ? (
                            rule.tools.map(toolId => {
                              const tool = AVAILABLE_TOOLS.find(t => t.id === toolId);
                              const ToolIcon = tool?.icon || Info;
                              return (
                                <span key={toolId} className={cn(
                                  "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all flex items-center gap-1.5",
                                  rule.active ? "bg-background text-muted-foreground border-border group-hover:border-primary/40" : "bg-background/30 text-muted-foreground opacity-50 border-border"
                                )}>
                                  <ToolIcon size={10} /> {tool?.label || toolId}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-[8px] font-bold text-muted-foreground uppercase italic tracking-widest opacity-60">NO_TOOLS_ASSOCIATED</span>
                          )}

                          {hoveredRegistryToolsId === rule.id && rule.tools.length > 0 && (
                            <div className="absolute bottom-full left-0 mb-4 w-[320px] bg-background border border-primary/30 rounded-[2.2rem] p-7 shadow-2xl z-[500] backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200 pointer-events-none border-l-4 border-l-primary origin-bottom-left overflow-hidden">
                              <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                    <Microchip size={14} />
                                  </div>
                                  <span className="text-[10px] font-black text-primary uppercase font-mono tracking-widest">TOOL_MANIFEST</span>
                                </div>
                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">SECURED_V3</span>
                              </div>
                              <div className="space-y-4">
                                {rule.tools.map(toolId => {
                                  const tool = AVAILABLE_TOOLS.find(t => t.id === toolId);
                                  const ToolIcon = tool?.icon || Info;
                                  return (
                                    <div key={toolId} className="flex gap-4 group/t-info">
                                      <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner group-hover/t-info:bg-primary/10 group-hover/t-info:border-primary/40 transition-all">
                                        <ToolIcon size={18} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-[10px] font-black text-foreground uppercase mb-0.5 tracking-tight flex items-center gap-2">
                                          {tool?.label || toolId}
                                        </div>
                                        <p className="text-[9px] text-muted-foreground italic leading-tight font-medium opacity-80">{tool?.description || 'Contextual tool binding.'}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="hidden lg:flex items-center gap-6 pr-8 border-l border-border/30 pl-8 shrink-0">
                         <div className="text-center">
                            <div className="text-[8px] font-black text-muted-foreground uppercase mb-1 tracking-widest opacity-60">SLA Max</div>
                            <div className={cn("text-[11px] font-black font-mono", rule.active ? "text-primary" : "text-muted-foreground")}>{rule.latencyLimit}ms</div>
                         </div>
                         <div className="text-center">
                            <div className="text-[8px] font-black text-muted-foreground uppercase mb-1 tracking-widest opacity-60">Bud/1k</div>
                            <div className={cn("text-[11px] font-black font-mono", rule.active ? "text-accent" : "text-muted-foreground")}>${rule.costThreshold}</div>
                         </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-6 pl-6 border-l border-border/50 shrink-0">
                      <button 
                        onClick={() => toggleRule(rule.id)} 
                        className={cn(
                          "w-10 h-5 rounded-full relative transition-all duration-500",
                          rule.active ? "bg-primary shadow-[0_0_15px_hsl(var(--primary))]" : "bg-muted"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-xl",
                          rule.active ? "right-1" : "left-1"
                        )}></div>
                      </button>
                      <button 
                        onClick={() => deleteRule(rule.id)} 
                        className="text-muted-foreground hover:text-destructive transition-all p-2 active:scale-75"
                        title="Decommission Rule"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
