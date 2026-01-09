
import React, { useState } from 'react';
import { CloudUpload, Activity, Coins, ShieldCheck, Key, Settings, Wrench } from 'lucide-react';
import { cn } from '../lib/utils';

export const AIaaSConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tiers' | 'usage' | 'api-keys' | 'monetization'>('tiers');

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter flex items-center gap-3">
            <CloudUpload className="text-primary" />
            AIaaS Orchestrator
          </h2>
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.3em] mt-1">Multi-Tenant API Service Manager</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-secondary/50 px-4 py-2 rounded-xl border border-border flex items-center gap-3 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-[10px] font-black text-muted-foreground font-mono">API_GATEWAY: ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-secondary/30 border border-border p-6 rounded-3xl space-y-2 shadow-xl backdrop-blur-sm">
          <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Coins size={10} className="text-accent" /> Total API Revenue
          </div>
          <div className="text-2xl font-black text-accent">$12,402.10</div>
          <div className="text-[8px] text-accent/50 uppercase font-black tracking-widest">+12% vs last 24h</div>
        </div>
        <div className="bg-secondary/30 border border-border p-6 rounded-3xl space-y-2 shadow-xl backdrop-blur-sm">
          <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Activity size={10} className="text-primary" /> Total Tokens Processed
          </div>
          <div className="text-2xl font-black text-primary">842.1M</div>
          <div className="text-[8px] text-primary/50 uppercase font-black tracking-widest">Avg Cost: $0.00012/1k</div>
        </div>
        <div className="bg-secondary/30 border border-border p-6 rounded-3xl space-y-2 shadow-xl backdrop-blur-sm">
          <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Settings size={10} className="text-foreground" /> Active Multi-Tenants
          </div>
          <div className="text-2xl font-black text-foreground">42 Nodes</div>
          <div className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Peak Load: 68%</div>
        </div>
        <div className="bg-secondary/30 border border-border p-6 rounded-3xl space-y-2 shadow-xl backdrop-blur-sm">
          <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={10} className="text-foreground" /> SLA Uptime
          </div>
          <div className="text-2xl font-black text-foreground">99.999%</div>
          <div className="text-[8px] text-accent uppercase font-black tracking-widest">Zero Incidents (24h)</div>
        </div>
      </div>

      <div className="bg-secondary/20 border border-border rounded-[3rem] overflow-hidden flex flex-col min-h-[500px] shadow-2xl backdrop-blur-sm">
        <div className="flex bg-background/50 border-b border-border p-3 gap-3">
          {[
            { id: 'tiers', label: 'Service Tiers', icon: Settings },
            { id: 'usage', label: 'Usage Analytics', icon: Activity },
            { id: 'api-keys', label: 'Key Management', icon: Key },
            { id: 'monetization', label: 'Monetization', icon: Coins }
          ].map((t) => {
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

        <div className="p-12 flex-1 flex items-center justify-center text-center">
          <div className="max-w-md space-y-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
              <Wrench className="relative text-primary opacity-20 w-24 h-24 mx-auto" />
            </div>
            <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter">Console View: {activeTab.toUpperCase()}</h3>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest leading-relaxed">
              This module is currently initializing telemetry hooks for the {activeTab} service. Automated usage metering and tiered billing sync is active in the background.
            </p>
            <button className="bg-secondary border border-border px-8 py-4 rounded-2xl text-[10px] font-black text-foreground uppercase tracking-widest hover:border-primary/50 transition-all shadow-lg active:scale-95">
              Initiate Manual Billing Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
