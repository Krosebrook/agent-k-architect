import React, { useState, Suspense, lazy } from 'react';
import { Sidebar } from './components/Sidebar';
import { MetricsGrid } from './components/MetricsGrid';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useProfile } from './hooks/useProfile';
import { useSystemUptime } from './hooks/useSystemUptime';

// Lazy loaded views for production performance
const SystemArchitecture = lazy(() => import('./components/SystemArchitecture').then(m => ({ default: m.SystemArchitecture })));
const ModelRouter = lazy(() => import('./components/ModelRouter').then(m => ({ default: m.ModelRouter })));
const SecurityDashboard = lazy(() => import('./components/SecurityDashboard').then(m => ({ default: m.SecurityDashboard })));
const ChatTerminal = lazy(() => import('./components/ChatTerminal').then(m => ({ default: m.ChatTerminal })));
const ProductDesigner = lazy(() => import('./components/ProductDesigner').then(m => ({ default: m.ProductDesigner })));
const AIaaSConsole = lazy(() => import('./components/AIaaSConsole').then(m => ({ default: m.AIaaSConsole })));

export type ViewState = 'architecture' | 'routing' | 'security' | 'terminal' | 'designer' | 'aiaas' | 'settings';

const LoadingFallback = () => (
  <div className="h-full flex flex-col items-center justify-center p-20 animate-pulse">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] font-mono">Initializing Node Telemetry...</span>
  </div>
);

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('architecture');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { profile, setProfile, loading: profileLoading } = useProfile();
  const systemUptime = useSystemUptime();

  const renderView = () => {
    if (profileLoading) return <LoadingFallback />;
    switch (activeView) {
      case 'architecture': return <SystemArchitecture profile={profile} />;
      case 'routing': return <ModelRouter />;
      case 'security': return <SecurityDashboard />;
      case 'terminal': return <ChatTerminal profile={profile} />;
      case 'designer': return <ProductDesigner />;
      case 'aiaas': return <AIaaSConsole />;
      case 'settings': return (
        <div className="bg-secondary/50 border border-border rounded-[3rem] p-12 space-y-12 shadow-2xl animate-in fade-in duration-500 backdrop-blur-md">
          <h2 className="text-4xl font-black text-foreground uppercase italic tracking-tighter border-b border-border pb-8">Global Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">User Profile</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-2xl p-4 text-sm font-mono focus:ring-2 focus:ring-primary outline-none text-foreground transition-all"
                  placeholder="Architect Name"
                />
                <input 
                  type="text" 
                  value={profile.role} 
                  onChange={e => setProfile({...profile, role: e.target.value})}
                  className="w-full bg-background border border-border rounded-2xl p-4 text-sm font-mono focus:ring-2 focus:ring-primary outline-none text-foreground transition-all"
                  placeholder="System Role"
                />
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Environment Status</h3>
              <div className="bg-background border border-border rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">API Runtime</span>
                  <span className="text-[10px] font-black text-primary uppercase">Authenticated</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Node Region</span>
                  <span className="text-[10px] font-black text-accent uppercase">US-EAST-1</span>
                </div>
                <div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                  <p className="text-[9px] text-muted-foreground leading-relaxed uppercase font-bold">Security Notice: API credentials are managed via secure environment injection. Manual overrides are disabled for production integrity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden bg-background text-foreground font-sans`}>
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        profile={profile}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        <header className="h-16 border-b border-border flex items-center justify-between px-8 shrink-0 bg-background/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h1 className="text-xs font-black tracking-[0.2em] text-primary uppercase font-mono leading-none mb-1">
                Agent-K // {profile.name.split(' ')[0]} Console
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">Node: {activeView.toUpperCase()}</span>
                <span className="w-1 h-1 rounded-full bg-border"></span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-mono animate-pulse">Status: Operational</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest font-mono">Uptime</span>
              <span className="text-xs font-black text-primary font-mono">{systemUptime}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth custom-scrollbar relative">
          <div className="max-w-[1400px] mx-auto space-y-8">
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                {renderView()}
              </Suspense>
            </ErrorBoundary>
            
            <div className="mt-12 pt-12 border-t border-border">
              <MetricsGrid />
            </div>
          </div>
        </div>

        <footer className="h-10 border-t border-border bg-background flex items-center px-8 justify-between text-[10px] font-mono text-muted-foreground shrink-0 font-bold uppercase tracking-widest">
          <div className="flex gap-8">
            <span>REGION: US-EAST-1</span>
            <span>VER: 6.0.1-PROD</span>
          </div>
          <span className="text-primary">SYSTEM_INTEGRITY: OPTIMAL</span>
        </footer>
      </main>

      <style>{`
        .bg-grid-pattern {
          background-image: radial-gradient(hsl(var(--primary)) 0.5px, transparent 0.5px);
          background-size: 24px 24px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary));
        }
      `}</style>
    </div>
  );
};

export default App;
