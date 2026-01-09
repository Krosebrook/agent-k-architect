import React, { useState } from 'react';
import { geminiService } from '../lib/geminiService';
import { TOP_50_BLUEPRINTS } from '../constants';
import { UserProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { 
  Cpu, 
  Layers, 
  Database, 
  ShieldAlert, 
  X, 
  Microchip, 
  CloudRain, 
  LayoutDashboard,
  Table,
  ShieldCheck,
  Compass,
  ArrowRight,
  LogIn,
  Save,
  Archive,
  Trash2,
  Wand2,
  Box
} from 'lucide-react';
import { blink } from '../lib/blink';
import { toast } from 'react-hot-toast';

interface SystemArchitectureProps {
  profile?: UserProfile;
}

export const SystemArchitecture: React.FC<SystemArchitectureProps> = ({ profile }) => {
  const { user, login } = useAuth();
  const [intent, setIntent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'designer' | 'vault'>('designer');
  const [savedSystems, setSavedSystems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  
  const categories = ['All', 'SaaS', 'AI', 'Fintech', 'Edge', 'Data', 'Security', 'DevOps'];
  
  const fetchVault = async () => {
    if (!user) return;
    try {
      const result = await blink.db.systems.list({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' }
      });
      setSavedSystems(result.map(s => ({
        ...s,
        architecture: JSON.parse(s.architecture || '{}')
      })));
    } catch (e) {
      console.error("Vault fetch failed", e);
    }
  };

  React.useEffect(() => {
    if (viewMode === 'vault') {
      fetchVault();
    }
  }, [viewMode, user]);

  const handleSaveToVault = async () => {
    if (!user || !blueprint) return;
    setIsSaving(true);
    try {
      await blink.db.systems.create({
        user_id: user.id,
        name: blueprint.title,
        description: blueprint.summary,
        architecture: JSON.stringify(blueprint)
      });
      toast.success('Blueprint committed to Archive Vault');
      setViewMode('vault');
    } catch (e) {
      console.error("Vault commit failed", e);
      toast.error('Vault synchronization failure');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFromVault = async (id: string) => {
    if (!user) return;
    try {
      await blink.db.systems.delete({
        where: { id, user_id: user.id }
      });
      setSavedSystems(prev => prev.filter(s => s.id !== id));
      toast.success('System purged from Vault');
    } catch (e) {
      toast.error('Purge operation failed');
    }
  };
  const filteredBlueprints = activeCategory === 'All' 
    ? TOP_50_BLUEPRINTS 
    : TOP_50_BLUEPRINTS.filter(b => b.category === activeCategory);

  const [nodes, setNodes] = useState([
    { id: 'auth', name: 'Auth Gateway', status: 'ACTIVE', load: 14, health: 98 },
    { id: 'api', name: 'Logic Core', status: 'ACTIVE', load: 42, health: 95 },
    { id: 'db', name: 'Primary Shard', status: 'ACTIVE', load: 68, health: 92 },
    { id: 'edge', name: 'Edge Worker', status: 'STANDBY', load: 0, health: 100 }
  ]);

  const handleSynthesize = async (pIntent?: string) => {
    const finalIntent = pIntent || intent;
    if (!finalIntent.trim() || isGenerating) return;
    
    // Check authentication before calling AI
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setShowAuthPrompt(false);
    try {
      const result = await geminiService.generateBlueprint(finalIntent);
      setBlueprint(result);
    } catch (err: any) {
      console.error(err);
      // Check for auth errors
      if (err.message?.includes('401') || err.message?.includes('Authentication') || err.message?.includes('auth')) {
        setShowAuthPrompt(true);
        setError("Authentication required. Please sign in to use the synthesis engine.");
      } else {
        setError(err.message || "Synthesis engine malfunction. Please try another directive.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter flex items-center gap-3">
            <Cpu className="text-primary" />
            Architecture Ops
          </h2>
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-0.3em mt-1">Real-Time Infrastructure Visualization</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-secondary/50 px-4 py-2 rounded-xl border border-border flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-[10px] font-black text-muted-foreground font-mono">PROD_NODES: 4/4</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-secondary/30 border border-border rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center justify-between">
              <span>Veteran Preset Registry</span>
              <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">TOP 50</span>
            </h3>

            <div className="flex flex-wrap gap-1.5 mb-6">
               {categories.map(cat => (
                 <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "text-[9px] font-black px-2.5 py-1 rounded-lg border transition-all uppercase tracking-tighter",
                    activeCategory === cat ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground hover:text-foreground"
                  )}
                 >
                   {cat}
                 </button>
               ))}
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredBlueprints.map(b => (
                <div key={b.id} className="p-1 border border-border rounded-2xl hover:border-primary/50 transition-all">
                  <button 
                    onClick={() => handleSynthesize(`Architect a production-grade ${b.title} using ${b.tech}. Focus on ${b.intent}`)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                      <i className={`fa-solid ${b.icon}`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-black text-foreground uppercase tracking-widest truncate">{b.title}</div>
                      <div className="text-[9px] text-muted-foreground truncate font-mono uppercase tracking-tighter">{b.tech}</div>
                    </div>
                    <Wand2 size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-secondary/30 border border-border rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Node Status</h3>
            <div className="space-y-4">
              {nodes.map(node => (
                <div key={node.id} className="bg-background/50 border border-border rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-foreground uppercase tracking-wider">{node.name}</span>
                    <span className={cn(
                      "text-[8px] font-bold px-2 py-0.5 rounded-full border",
                      node.status === 'ACTIVE' ? "bg-accent/10 text-accent border-accent/20" : "bg-muted text-muted-foreground border-border"
                    )}>
                      {node.status}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-secondary rounded-full overflow-hidden mb-1">
                    <div 
                      className={cn("h-full transition-all duration-1000", node.load > 60 ? "bg-destructive" : "bg-primary")} 
                      style={{ width: `${node.load}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[8px] text-muted-foreground font-black uppercase font-mono">
                    <span>Load: {node.load}%</span>
                    <span>Health: {node.health}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          {showAuthPrompt && (
            <div className="mb-6 p-6 bg-primary/10 border border-primary/20 rounded-[2rem] animate-in slide-in-from-top-4 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <LogIn size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Authentication Required</h4>
                  <p className="text-xs text-foreground font-mono italic">Sign in to access AI-powered synthesis features.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={login}
                  className="px-4 py-2 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-wider rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </button>
                <button onClick={() => setShowAuthPrompt(false)} className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                  <X size={16} className="text-primary" />
                </button>
              </div>
            </div>
          )}

          {error && !showAuthPrompt && (
            <div className="mb-6 p-6 bg-destructive/10 border border-destructive/20 rounded-[2rem] animate-in slide-in-from-top-4 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center text-destructive">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-destructive uppercase tracking-widest">Synthesis Failure</h4>
                  <p className="text-xs text-foreground font-mono italic">{error}</p>
                </div>
              </div>
              <button onClick={() => setError(null)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                <X size={16} className="text-destructive" />
              </button>
            </div>
          )}

          {isGenerating ? (
            <div className="h-full min-h-[600px] bg-secondary/20 border border-border rounded-[3rem] flex flex-col items-center justify-center p-20 text-center animate-pulse">
              <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8 shadow-glow"></div>
              <h3 className="text-2xl font-black text-foreground uppercase italic tracking-widest">Synthesizing Blueprint</h3>
              <p className="text-[10px] text-muted-foreground font-mono mt-2 uppercase tracking-widest">Grounded Search Active // Auditing Category: {activeCategory}</p>
            </div>
          ) : blueprint ? (
            <div className="bg-secondary/20 border border-border rounded-[3rem] p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 flex gap-3">
                <button onClick={() => setBlueprint(null)} className="text-muted-foreground hover:text-foreground transition-colors w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-12 border-b border-border pb-12">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[9px] font-black text-primary bg-primary/5 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-widest">Architectural_Commit_4.2</span>
                  <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-widest">Checksum: {Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
                </div>
                <h1 className="text-5xl font-black text-foreground uppercase italic tracking-tighter leading-none">{blueprint.title}</h1>
                <p className="text-lg text-muted-foreground mt-8 leading-relaxed max-w-4xl border-l-4 border-primary pl-10 py-6 italic bg-primary/5 rounded-r-[3rem]">
                  {blueprint.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-10">
                   <h4 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-3">
                     <Layers className="text-primary" size={16} /> Infrastructure Matrix
                   </h4>
                   <div className="space-y-4">
                     {blueprint.layers.map((layer: any) => (
                       <div key={layer.name} className="p-8 bg-background/50 border border-border rounded-[2.5rem] group hover:border-primary/40 transition-all shadow-xl border-l-4 border-l-transparent hover:border-l-primary">
                         <div className="flex items-center gap-4 mb-6">
                           <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                             <Box size={24} />
                           </div>
                           <div>
                             <h4 className="text-sm font-black text-foreground uppercase tracking-widest italic">{layer.name}</h4>
                             <div className="text-[10px] text-primary font-mono uppercase tracking-[0.2em]">{layer.tech}</div>
                           </div>
                         </div>
                         <p className="text-xs text-muted-foreground leading-relaxed italic">{layer.rationale}</p>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="space-y-10">
                   <h4 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-3">
                     <Database className="text-accent" size={16} /> Entity Schema (Postgres)
                   </h4>
                   <div className="space-y-4">
                      {blueprint.dataModel.map((d: any) => (
                        <div key={d.table} className="p-6 bg-background/50 border border-border rounded-3xl font-mono shadow-inner">
                          <div className="text-[11px] font-black text-accent uppercase mb-4 flex items-center gap-3">
                            <Table size={14} /> {d.table}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {d.columns.map((c: string, j: number) => (
                              <span key={j} className="text-[10px] bg-secondary border border-border px-4 py-1.5 rounded-xl text-muted-foreground font-bold tracking-tight">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                   </div>

                   <h4 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-3 pt-6">
                     <ShieldAlert className="text-destructive" size={16} /> Security Directives
                   </h4>
                   <div className="grid grid-cols-2 gap-4">
                      {blueprint.security.map((s: string, i: number) => (
                        <div key={i} className="text-[10px] font-black text-muted-foreground bg-destructive/5 border border-destructive/10 px-5 py-4 rounded-[1.5rem] uppercase tracking-tighter italic hover:bg-destructive/10 transition-colors flex items-center gap-3 leading-tight">
                          <ShieldCheck className="text-destructive/50" size={14} />
                          {s}
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[4rem] bg-secondary/10 text-muted-foreground p-20 text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <Compass className="w-40 h-40 mb-12 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 text-primary" />
               <h3 className="text-4xl font-black uppercase tracking-[0.2em] italic mb-6 text-muted-foreground/50">Awaiting Directive</h3>
               <p className="text-xs font-mono max-w-sm text-muted-foreground leading-relaxed uppercase tracking-widest">
                 Commit a veteran configuration from the registry to initiate high-fidelity architectural synthesis.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
