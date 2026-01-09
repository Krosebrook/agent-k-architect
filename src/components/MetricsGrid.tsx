
import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../lib/utils';

export const MetricsGrid: React.FC = () => {
  const metrics = [
    { label: 'System Load', value: '14.2%', trend: 'down', color: 'text-accent' },
    { label: 'Avg Latency', value: '184ms', trend: 'up', color: 'text-yellow-400' },
    { label: 'Cost/Request', value: '$0.0004', trend: 'stable', color: 'text-primary' },
    { label: 'Queue Depth', value: '42 ops', trend: 'down', color: 'text-accent' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
      {metrics.map((m, i) => (
        <div key={i} className="bg-secondary/30 border border-border rounded-2xl p-5 hover:border-primary/50 transition-all group backdrop-blur-sm shadow-lg">
          <div className="text-[10px] text-muted-foreground font-black mb-1 uppercase tracking-widest">{m.label}</div>
          <div className="flex items-end justify-between">
            <div className={cn("text-2xl font-black tracking-tighter italic", m.color)}>{m.value}</div>
            <div className="text-[9px] flex items-center gap-1 font-black uppercase tracking-tighter">
               {m.trend === 'up' && <ArrowUpRight className="text-destructive" size={12} />}
               {m.trend === 'down' && <ArrowDownRight className="text-accent" size={12} />}
               {m.trend === 'stable' && <Minus className="text-muted-foreground" size={12} />}
               <span className="text-muted-foreground/50">{m.trend}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
