
import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-background border border-destructive/50 rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-destructive"></div>
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 text-destructive text-2xl border border-destructive/20">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-black text-foreground uppercase tracking-widest mb-2 italic">System Critical Error</h2>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-6">Node Exception Detected</p>
            <div className="bg-destructive/5 border border-destructive/10 p-4 rounded-xl text-left mb-6 overflow-auto max-h-32 custom-scrollbar">
              <p className="text-xs font-mono text-destructive break-words">{this.state.error?.message || 'Unknown error occurred in subsystem.'}</p>
            </div>
            <button 
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="w-full py-4 bg-destructive hover:bg-destructive/80 text-destructive-foreground font-black rounded-xl uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95"
            >
                <RefreshCw className="inline-block mr-2" size={14} /> Reboot Node
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
