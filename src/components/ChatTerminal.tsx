
import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../lib/geminiService';
import { ChatMessage, UserProfile } from '../types';
import { 
  Terminal, 
  ArrowUp, 
  Link as LinkIcon, 
  ShieldAlert, 
  Cpu, 
  User, 
  HelpCircle, 
  XCircle,
  Command
} from 'lucide-react';
import { cn } from '../lib/utils';

interface TerminalProps {
  profile: UserProfile;
}

export const ChatTerminal: React.FC<TerminalProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `System ready. Architect ${profile.name.split(' ')[0]} initialized. Try /help for commands.`,
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCommand = async (cmd: string): Promise<string | null> => {
    const parts = cmd.split(' ');
    const base = parts[0].toLowerCase();

    switch (base) {
      case '/help':
        return `AVAILABLE_COMMANDS:
/help - Show this menu
/clear - Clear terminal logs
/whoami - Show current user profile
/system - Display node telemetry
/exec [prompt] - Run direct AI execution`;
      case '/clear':
        setMessages([]);
        return null;
      case '/whoami':
        return `USER: ${profile.name}
ROLE: ${profile.role}
SESSION: ACTIVE`;
      case '/system':
        return `NODE: AGENT-K-PWA-6.0
UPTIME: ${window.performance.now().toFixed(0)}ms
VERSION: 6.0.1-PROD`;
      case '/exec':
        const prompt = parts.slice(1).join(' ');
        if (!prompt) return "ERROR: Missing prompt. Usage: /exec [prompt]";
        try {
          const res = await geminiService.chatWithGrounding(prompt, []);
          return `EXECUTION_RESULT:\n${res.response.candidates[0].content.parts[0].text}`;
        } catch (e: any) {
          return `EXECUTION_FAILED: ${e.message}`;
        }
      default:
        return null;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    if (input.startsWith('/')) {
      const result = await handleCommand(input);
      if (result) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'system',
          content: result,
          timestamp: new Date().toLocaleTimeString(),
        }]);
      }
      setIsTyping(false);
      return;
    }

    try {
      const securityCheck = await geminiService.analyzeSystemPrompt(input);
      
      if (securityCheck.securityLevel === 'MALICIOUS') {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'system',
          content: `SECURITY ALERT: ${securityCheck.reasoning}`,
          timestamp: new Date().toLocaleTimeString(),
        }]);
        setIsTyping(false);
        return;
      }

      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : m.role,
        parts: [{ text: m.content }]
      })).filter(h => h.role !== 'system');

      const response = await geminiService.chatWithGrounding(input, history);
      const text = response.response.candidates[0].content.parts[0].text;
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text || "No response received.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `Error: ${err.message || 'Connection failure.'}`,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-background border border-border rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in duration-500">
      <div className="bg-secondary/50 px-6 py-4 flex items-center justify-between border-b border-border backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-4">
            <div className="w-3 h-3 rounded-full bg-destructive/40 border border-destructive/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500/50"></div>
          </div>
          <Terminal size={14} className="text-primary" />
          <span className="text-xs font-bold text-muted-foreground font-mono tracking-widest uppercase italic tracking-tighter">Terminal_{profile.name.split(' ')[0]}</span>
        </div>
        <div className="text-[10px] text-accent font-mono font-black">PERSISTENT_SESSION_ENABLED</div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar bg-background/50">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[85%] rounded-2xl p-4 shadow-lg",
              msg.role === 'user' 
                ? "bg-primary text-primary-foreground" 
                : msg.role === 'system' 
                ? "bg-destructive/10 border border-destructive/30 text-destructive font-mono text-xs" 
                : "bg-secondary/80 text-foreground border border-border"
            )}>
              {msg.role !== 'user' && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-50 flex items-center gap-1">
                    {msg.role === 'assistant' ? <Command size={10} /> : <Cpu size={10} />}
                    {msg.role === 'assistant' ? 'Tessa' : 'System'}
                  </span>
                  <span className="text-[9px] opacity-30">{msg.timestamp}</span>
                </div>
              )}
              <div className={cn(
                "text-sm leading-relaxed whitespace-pre-wrap font-mono tracking-tight",
                msg.role === 'user' ? "font-sans" : "font-mono"
              )}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-secondary/80 rounded-2xl p-4 border border-border flex items-center gap-3 shadow-lg">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono font-bold tracking-widest">EXECUTING...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-secondary/30 border-t border-border backdrop-blur-md">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type command (/help) or architectural directive..."
            className="w-full bg-background/80 border border-border rounded-xl py-3 pl-4 pr-12 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono shadow-inner"
          />
          <button type="submit" disabled={isTyping} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary hover:bg-accent text-primary-foreground transition-all shadow-lg active:scale-95 disabled:opacity-50">
            <ArrowUp size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
