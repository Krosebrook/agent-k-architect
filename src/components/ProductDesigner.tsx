
import React, { useState } from 'react';
import { geminiService } from '../lib/geminiService';
import { TechStack, Manifest } from '../types';
import { 
  Lightbulb, 
  Wand2, 
  Atom, 
  FileText, 
  Rocket, 
  Code, 
  Book, 
  Settings, 
  Network, 
  GitBranch, 
  Copy,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

const FRAMEWORKS = ['Next.js (App Router)', 'FastAPI (Python)', 'NestJS (Node)', 'Go (Gin)', 'SvelteKit', 'Laravel', 'Flutter', 'SST (Ion)'];
const ARCHITECTURES = ['Microservices (Mesh)', 'Event-Driven (Pub/Sub)', 'Edge-First (Serverless)', 'Monolithic (Modular)', 'Hexagonal', 'CQRS', 'Clean Arch'];
const INFRA_TOOLS = ['Supabase (DB/Auth)', 'AWS (RDS/S3)', 'Firebase', 'MongoDB Atlas', 'Neon (Postgres)', 'Redis (Upstash)', 'Cloudflare D1', 'Pinecone (Vector)'];
const INTELLIGENCE_TOOLS = ['Gemini 3 Pro', 'Claude 3.5 Sonnet', 'GPT-4o', 'Llama 3 (Groq)', 'Ollama (Local)', 'Mistral Large'];
const DEPLOYMENT_PLATFORMS = ['Vercel (Edge)', 'AWS Amplify', 'Cloudflare Pages', 'Railway', 'Netlify', 'Render', 'K8s (EKS)', 'Coolify'];
const REPOSITORIES = ['GitHub Mono-repo', 'GitLab Distributed', 'Bitbucket Enterprise', 'Azure DevOps', 'Self-hosted Gitea'];
const DOC_STANDARDS = ['Technical PRD', 'OpenAPI (Swagger)', 'Architecture RFC', 'System ADR', 'User Operations Guide'];
const CODE_STYLES = ['Veteran (Clean Code)', 'Rapid Prototype', 'Enterprise (Strict Types)', 'Extreme Performance', 'Minimalist'];

const STATE_MANAGEMENT = ['Zustand (Lightweight)', 'Redux Toolkit (Complex)', 'React Query (Server-state)', 'Server Actions Only', 'Context API'];
const DATA_CONSISTENCY = ['Eventual Consistency', 'Strong ACID', 'Causal Consistency', 'Hybrid (Read-After-Write)'];
const ERROR_PATTERNS = ['Graceful Degradation', 'Circuit Breaker', 'Retry with Backoff', 'Fail-Fast (Panic)', 'Safe-Mode Fallback'];

export const ProductDesigner: React.FC = () => {
  const [intent, setIntent] = useState('');
  const [stack, setStack] = useState<TechStack>({
    framework: FRAMEWORKS[0],
    architecture: ARCHITECTURES[0],
    infrastructure: [INFRA_TOOLS[0]],
    intelligence: [INTELLIGENCE_TOOLS[0]],
    deployment: DEPLOYMENT_PLATFORMS[0],
    repository: REPOSITORIES[0],
    documentation: DOC_STANDARDS[0],
    codeStyle: CODE_STYLES[0],
    stateManagement: STATE_MANAGEMENT[0],
    dataConsistency: DATA_CONSISTENCY[0],
    errorPattern: ERROR_PATTERNS[0]
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [activeTab, setActiveTab] = useState<'manifest' | 'aiaas' | 'scaffold' | 'docs' | 'ops'>('manifest');

  const handleSynthesize = async () => {
    if (!intent.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const result = await geminiService.synthesizeDeepManifest({ ...stack, intent });
      setManifest(result);
      setActiveTab('manifest');
      toast.success('Product artifacts synthesized');
    } catch (err) {
      console.error(err);
      toast.error('Synthesis failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSelection = (key: keyof TechStack, item: string) => {
    setStack(prev => {
      const val = prev[key];
      if (Array.isArray(val)) {
        return { ...prev, [key]: val.includes(item) ? val.filter(i => i !== item) : [...val, item] };
      }
      return { ...prev, [key]: item };
    });
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">Product Synthesizer</h2>
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.3em] mt-1">Multi-Stack Orchestration Engine v5.0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-secondary/30 border border-border rounded-[2.5rem] p-8 shadow-2xl space-y-8 backdrop-blur-xl">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Lightbulb className="text-primary" size={14} /> Core Intent
              </label>
              <textarea 
                value={intent}
                onChange={e => setIntent(e.target.value)}
                placeholder="A high-performance AIaaS platform for financial forecasting..."
                className="w-full h-32 bg-background border border-border rounded-2xl p-4 text-xs text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-mono resize-none transition-all shadow-inner"
              />
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase">Framework</label>
                  <select value={stack.framework} onChange={e => toggleSelection('framework', e.target.value)} className="w-full bg-background border border-border rounded-xl p-2 text-[10px] text-foreground font-mono outline-none focus:ring-1 focus:ring-primary">
                    {FRAMEWORKS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase">Architecture</label>
                  <select value={stack.architecture} onChange={e => toggleSelection('architecture', e.target.value)} className="w-full bg-background border border-border rounded-xl p-2 text-[10px] text-foreground font-mono outline-none focus:ring-1 focus:ring-primary">
                    {ARCHITECTURES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-border pt-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest text-primary">State Management</label>
                  <select value={stack.stateManagement} onChange={e => toggleSelection('stateManagement', e.target.value)} className="w-full bg-background border border-border rounded-xl p-3 text-[10px] text-foreground font-mono outline-none focus:ring-1 focus:ring-primary">
                    {STATE_MANAGEMENT.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest text-accent">Data Consistency</label>
                  <select value={stack.dataConsistency} onChange={e => toggleSelection('dataConsistency', e.target.value)} className="w-full bg-background border border-border rounded-xl p-3 text-[10px] text-foreground font-mono outline-none focus:ring-1 focus:ring-primary">
                    {DATA_CONSISTENCY.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest text-destructive">Error Handling Pattern</label>
                  <select value={stack.errorPattern} onChange={e => toggleSelection('errorPattern', e.target.value)} className="w-full bg-background border border-border rounded-xl p-3 text-[10px] text-foreground font-mono outline-none focus:ring-1 focus:ring-primary">
                    {ERROR_PATTERNS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-border pt-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Repository Protocol</label>
                  <select value={stack.repository} onChange={e => toggleSelection('repository', e.target.value)} className="w-full bg-background border border-border rounded-xl p-3 text-[10px] text-foreground font-mono outline-none focus:ring-1 focus:ring-primary">
                    {REPOSITORIES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Documentation Standard</label>
                  <select value={stack.documentation} onChange={e => toggleSelection('documentation', e.target.value)} className="w-full bg-background border border-border rounded-xl p-3 text-[10px] text-foreground font-mono outline-none focus:ring-1 focus:ring-primary">
                    {DOC_STANDARDS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSynthesize} 
              disabled={isGenerating || !intent.trim()} 
              className="w-full bg-primary hover:bg-accent text-primary-foreground font-black text-xs uppercase py-5 rounded-[2rem] shadow-xl active:scale-95 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            >
              {isGenerating ? <Atom className="animate-spin" size={20} /> : <Wand2 size={20} />}
              {isGenerating ? 'Synthesizing Production Artifacts...' : 'Commit Synthesis'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          {isGenerating ? (
            <div className="h-full min-h-[600px] bg-secondary/20 border border-border rounded-[3rem] p-20 flex flex-col items-center justify-center text-center animate-pulse">
              <div className="w-32 h-32 border-4 border-primary border-t-transparent rounded-full animate-spin mb-10 shadow-glow"></div>
              <h3 className="text-3xl font-black text-foreground uppercase italic tracking-widest">Synthesizing Product Architecture</h3>
              <p className="text-xs text-muted-foreground font-mono mt-4">Wiring Repository // Building Documentation // Implementing Error Patterns</p>
            </div>
          ) : manifest ? (
            <div className="bg-secondary/20 border border-border rounded-[3rem] overflow-hidden flex flex-col h-full shadow-2xl backdrop-blur-sm">
               <div className="flex bg-background/50 border-b border-border p-3 gap-3">
                 {[
                   { id: 'manifest', label: 'Manifest', icon: FileText },
                   { id: 'aiaas', label: 'AIaaS Spec', icon: Rocket },
                   { id: 'scaffold', label: 'Code Scaffold', icon: Code },
                   { id: 'docs', label: 'Docs Bundle', icon: Book },
                   { id: 'ops', label: 'CI/CD Ops', icon: Settings }
                 ].map(t => {
                   const Icon = t.icon;
                   return (
                     <button 
                      key={t.id} 
                      onClick={() => setActiveTab(t.id as any)} 
                      className={cn(
                        "flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3",
                        activeTab === t.id ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                     >
                       <Icon size={14} /> {t.label}
                     </button>
                   );
                 })}
               </div>

               <div className="p-12 flex-1 overflow-y-auto custom-scrollbar">
                 {activeTab === 'manifest' && (
                   <div className="space-y-12 animate-in slide-in-from-bottom-4">
                      <div className="border-b border-border pb-10">
                         <h1 className="text-5xl font-black text-foreground uppercase italic tracking-tighter mb-6">{manifest.title}</h1>
                         <div className="flex flex-wrap gap-3 mb-8">
                            <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase">{stack.stateManagement}</span>
                            <span className="px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-black text-accent uppercase">{stack.dataConsistency}</span>
                            <span className="px-4 py-1.5 bg-destructive/10 border border-destructive/20 rounded-full text-[10px] font-black text-destructive uppercase">{stack.errorPattern}</span>
                         </div>
                         <p className="mt-4 text-lg text-muted-foreground italic leading-relaxed border-l-4 border-primary pl-8">{manifest.summary}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="space-y-4">
                            <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                               <GitBranch className="text-primary" size={14} /> Repo Architecture
                            </h4>
                            <div className="p-8 bg-background/50 border border-border rounded-[2.5rem] text-[11px] text-muted-foreground italic font-mono leading-relaxed shadow-xl">
                               {manifest.orchestration.repoStructure}
                            </div>
                         </div>
                         <div className="space-y-4">
                            <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                               <Network className="text-accent" size={14} /> Infrastructure Wiring
                            </h4>
                            <div className="p-8 bg-background/50 border border-border rounded-[2.5rem] text-[11px] text-muted-foreground italic leading-relaxed shadow-xl border-l-4 border-l-accent">
                               {manifest.orchestration.wiring}
                            </div>
                         </div>
                      </div>
                   </div>
                 )}

                 {activeTab === 'aiaas' && (
                   <div className="space-y-10 animate-in slide-in-from-bottom-4">
                      <div className="bg-primary/5 border border-primary/20 p-10 rounded-[3rem] space-y-8">
                         <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">AIaaS Monetization Model</h2>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {manifest.aiaas?.tiers.map((tier, i) => (
                             <div key={i} className="bg-background/50 border border-border p-6 rounded-3xl space-y-4 shadow-lg">
                               <div className="text-[10px] font-black text-primary uppercase tracking-widest">{tier.name}</div>
                               <div className="text-2xl font-black text-foreground">{tier.pricing}</div>
                               <div className="text-[9px] text-muted-foreground font-mono uppercase">Quota: {tier.rpm} RPM // {tier.tpd} TPD</div>
                             </div>
                           ))}
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                         <div className="p-8 bg-background/50 border border-border rounded-[2.5rem] space-y-3 shadow-lg">
                            <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Gateway Logic</h4>
                            <p className="text-xs text-muted-foreground italic">{manifest.aiaas?.gateway}</p>
                         </div>
                         <div className="p-8 bg-background/50 border border-border rounded-[2.5rem] space-y-3 shadow-lg">
                            <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Metering Engine</h4>
                            <p className="text-xs text-muted-foreground italic">{manifest.aiaas?.metering}</p>
                         </div>
                      </div>
                   </div>
                 )}

                 {activeTab === 'scaffold' && (
                   <div className="space-y-10 animate-in slide-in-from-bottom-4">
                      {manifest.scaffold.map((f, i) => (
                        <div key={i} className="space-y-3">
                          <div className="flex justify-between px-4">
                             <span className="text-[10px] font-black text-muted-foreground font-mono uppercase tracking-widest">{f.path}</span>
                             <span className="text-[9px] bg-secondary px-3 py-0.5 rounded-full text-primary font-mono border border-border">{f.language}</span>
                          </div>
                          <div className="bg-background/80 p-10 rounded-[3rem] border border-border font-mono text-[12px] text-foreground overflow-x-auto whitespace-pre shadow-2xl relative group">
                             <button className="absolute top-6 right-8 text-muted-foreground hover:text-primary transition-colors" title="Copy to clipboard">
                               <Copy size={16} />
                             </button>
                             {f.content}
                          </div>
                        </div>
                      ))}
                   </div>
                 )}

                 {activeTab === 'docs' && (
                   <div className="space-y-12 animate-in slide-in-from-bottom-4">
                      <div className="bg-accent/5 border border-accent/20 p-10 rounded-[3rem]">
                         <h4 className="text-sm font-black text-accent uppercase mb-4 flex items-center gap-2">
                           <Book size={16} /> OpenAPI Specification
                         </h4>
                         <div className="bg-background/50 p-8 rounded-2xl font-mono text-[10px] text-muted-foreground overflow-y-auto h-64 border border-border">
                           {manifest.documentation.openapiSpec}
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-6">
                            <h4 className="text-[11px] font-black text-destructive uppercase tracking-widest">Technical Constraints</h4>
                            {manifest.documentation.constraints.map((c, i) => (
                              <div key={i} className="p-6 bg-destructive/5 border border-destructive/10 rounded-2xl text-[11px] text-muted-foreground italic shadow-md">{c}</div>
                            ))}
                         </div>
                         <div className="space-y-6">
                            <h4 className="text-[11px] font-black text-accent uppercase tracking-widest">Production Guardrails</h4>
                            {manifest.documentation.guardrails.map((g, i) => (
                              <div key={i} className="p-6 bg-accent/5 border border-accent/10 rounded-2xl text-[11px] text-muted-foreground italic shadow-md">{g}</div>
                            ))}
                         </div>
                      </div>
                   </div>
                 )}

                 {activeTab === 'ops' && (
                   <div className="space-y-10 animate-in slide-in-from-bottom-4">
                      <div className="p-10 bg-background/50 border border-border rounded-[3.5rem] space-y-6 shadow-2xl">
                         <div className="flex items-center gap-4 border-b border-border pb-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl shadow-lg">
                               <Settings size={24} />
                            </div>
                            <div>
                               <h3 className="text-xl font-black text-foreground uppercase italic tracking-tighter">CI/CD Pipeline Blueprint</h3>
                               <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">GitHub Actions + Vercel Workflow</p>
                            </div>
                         </div>
                         <div className="text-sm text-muted-foreground italic leading-relaxed whitespace-pre-wrap font-mono bg-background/30 p-6 rounded-2xl border border-border">
                            {manifest.orchestration.cicdPipeline}
                         </div>
                      </div>
                   </div>
                 )}
               </div>
            </div>
          ) : (
            <div className="h-full min-h-[600px] border-2 border-dashed border-border rounded-[3rem] bg-secondary/10 flex flex-col items-center justify-center text-center p-20 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <Atom className="w-40 h-40 mb-10 opacity-10 group-hover:scale-110 transition-all duration-700 text-primary" />
               <h3 className="text-3xl font-black uppercase tracking-[0.2em] italic mb-4 text-muted-foreground/50">Awaiting SDLC Directive</h3>
               <p className="text-xs text-muted-foreground/70 max-w-sm font-mono uppercase leading-relaxed tracking-widest">
                 Configure your stack and architectural tiers to generate a production manifest.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
