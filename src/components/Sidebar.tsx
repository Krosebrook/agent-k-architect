
import React from 'react';
import { ViewState } from '../App';
import { UserProfile } from '../types';
import { 
  LayoutDashboard, 
  PenTool, 
  CloudUpload, 
  Route, 
  ShieldCheck, 
  Terminal, 
  Settings, 
  ChevronLeft, 
  Menu 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  profile: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isOpen, toggleSidebar, profile }) => {
  const navItems = [
    { id: 'architecture', icon: LayoutDashboard, label: 'Architecture' },
    { id: 'designer', icon: PenTool, label: 'Product Designer' },
    { id: 'aiaas', icon: CloudUpload, label: 'AIaaS Console' },
    { id: 'routing', icon: Route, label: 'Model Router' },
    { id: 'security', icon: ShieldCheck, label: 'Security Guard' },
    { id: 'terminal', icon: Terminal, label: 'Terminal' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as { id: ViewState, icon: any, label: string }[];

  return (
    <aside className={cn(
      "h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-20",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="p-6 h-16 border-b border-sidebar-border flex items-center justify-between shrink-0">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground shadow-lg italic tracking-tighter">K</div>
            <span className="font-bold tracking-tight text-foreground uppercase italic tracking-tighter">Agent K</span>
          </div>
        )}
        <button onClick={toggleSidebar} className="text-muted-foreground hover:text-foreground transition-colors">
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl transition-all group whitespace-nowrap",
                activeView === item.id 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon size={20} className={cn(!isOpen && "mx-auto")} />
              {isOpen && <span className="text-sm font-black uppercase tracking-widest italic">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-xs shrink-0">
             {profile.name.charAt(0)}
           </div>
           {isOpen && (
             <div className="flex flex-col overflow-hidden">
               <span className="text-[10px] font-black text-foreground uppercase tracking-tighter truncate">{profile.name}</span>
               <span className="text-[8px] text-accent uppercase font-black">{profile.role}</span>
             </div>
           )}
        </div>
      </div>
    </aside>
  );
};
