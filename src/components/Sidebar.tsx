import React, { useMemo } from 'react';
import { ViewState } from '../App';
import { UserProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  PenTool, 
  CloudUpload, 
  Route, 
  ShieldCheck, 
  Terminal, 
  Settings, 
  ChevronLeft, 
  Menu,
  LogIn,
  LogOut,
  Cpu,
  Box,
  Layout
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
  const { user, login, logout } = useAuth();
  const navItems = useMemo(() => [
    { id: 'architecture', icon: Cpu, label: 'Ops' },
    { id: 'aiaas', icon: Box, label: 'AIaaS' },
    { id: 'routing', icon: Route, label: 'Routing' },
    { id: 'security', icon: ShieldCheck, label: 'Guard' },
    { id: 'designer', icon: Layout, label: 'Studio' },
    { id: 'terminal', icon: Terminal, label: 'Link' },
    { id: 'settings', icon: Settings, label: 'Config' }
  ] as { id: ViewState, icon: any, label: string }[], []);

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
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
               <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-xs shrink-0">
                 {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
               </div>
               {isOpen && (
                 <div className="flex flex-col overflow-hidden">
                   <span className="text-[10px] font-black text-foreground uppercase tracking-tighter truncate">{user.displayName || user.email?.split('@')[0]}</span>
                   <span className="text-[8px] text-accent uppercase font-black">Authenticated</span>
                 </div>
               )}
            </div>
            {isOpen && (
              <button 
                onClick={logout}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        ) : (
          <button 
            onClick={login}
            className={cn(
              "w-full flex items-center gap-4 p-3 rounded-xl transition-all bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20",
              !isOpen && "justify-center"
            )}
          >
            <LogIn size={20} />
            {isOpen && <span className="text-sm font-black uppercase tracking-widest italic">Sign In</span>}
          </button>
        )}
      </div>
    </aside>
  );
};
