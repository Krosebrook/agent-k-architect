/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, useRef, useState, ReactNode, ErrorInfo, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import { BaseProps, TooltipProps, SectionProps, AuthorCardProps } from '../../types';

/** 
 * Standard container for consistent horizontal layout and max-width.
 */
export const Container: React.FC<BaseProps> = ({ children, className = "" }) => (
  <div className={`container px-6 mx-auto ${className}`}>
    {children}
  </div>
);

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/** 
 * Production-grade Error Boundary.
 * Catches rendering exceptions to prevent total app failure.
 */
// Fix: Use the imported Component class directly to ensure proper inheritance of state, props, and setState.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.group('FFAI System Isolation');
    console.error("Critical Failure:", error);
    console.info("Stack Trace:", errorInfo.componentStack);
    console.groupEnd();
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // Fix: this.props and this.state are correctly accessed.
      return this.props.fallback || (
        <div 
          role="alert"
          className="flex flex-col items-center justify-center min-h-[600px] p-20 text-center bg-stone-50 dark:bg-stone-950 rounded-[5rem] border border-stone-200 dark:border-stone-800 shadow-5xl"
        >
          <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-[2rem] flex items-center justify-center mb-12 shadow-inner">
            <span className="text-5xl font-serif font-bold">!</span>
          </div>
          <h3 className="font-serif text-5xl mb-8 text-stone-900 dark:text-stone-100 tracking-tight">Sector Isolated</h3>
          <p className="text-stone-500 dark:text-stone-400 max-w-xl mb-16 text-xl leading-relaxed">
            A critical violation was detected in this sector. The orchestrator has isolated the fault to preserve the integrity of the federated stack.
          </p>
          <button 
            // Fix: this.setState is accessible via Component inheritance.
            onClick={() => this.setState({ hasError: false })}
            className="px-12 py-5 bg-stone-900 dark:bg-stone-50 text-white dark:text-stone-900 rounded-full font-bold uppercase tracking-[0.4em] text-[12px] hover:bg-fusion-bolt dark:hover:bg-fusion-bolt dark:hover:text-white transition-all shadow-4xl active:scale-95"
          >
            Re-Initialize Hub
          </button>
        </div>
      );
    }
    
    // Fix: this.props.children is accessible through the inherited properties of the base Component class.
    return this.props.children;
  }
}

/** 
 * Accessible, physics-based Tooltip.
 */
export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  className = "", 
  position = "top", 
  delay = 150 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  
  const show = () => {
    timeoutRef.current = window.setTimeout(() => setIsVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const positionMap = useMemo(() => ({
    top: "bottom-full mb-4 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-4 left-1/2 -translate-y-1/2",
    left: "right-full mr-4 top-1/2 -translate-y-1/2",
    right: "left-full ml-4 top-1/2 -translate-y-1/2"
  }), []);

  return (
    <div 
      className={`relative inline-flex flex-col items-center ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      tabIndex={0}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 6 : -6 }}
            className={`absolute ${positionMap[position]} px-6 py-3.5 bg-stone-900 dark:bg-stone-800 text-stone-100 text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-6xl z-[150] border border-white/10 pointer-events-none whitespace-nowrap`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

/** 
 * Modular Parallax Section.
 */
export const ParallaxSection: React.FC<SectionProps> = ({ children, id, className = "", variant = "light", ariaLabel }) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  
  const yOffset = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const springY = useSpring(yOffset, { stiffness: 45, damping: 25 });
  
  const themeStyles = useMemo(() => ({
    light: "bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-50",
    dark: "bg-stone-950 text-stone-100",
    accent: "bg-stone-50 dark:bg-stone-900/40 text-stone-900 dark:text-stone-50"
  }), []);

  return (
    <section 
      id={id} 
      ref={containerRef} 
      aria-label={ariaLabel || id}
      className={`relative py-32 md:py-64 transition-colors duration-1000 ${themeStyles[variant]} ${className}`}
    >
      <motion.div style={{ y: springY }} className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-gradient-to-br from-fusion-bolt/10 to-transparent rounded-full blur-[180px]" />
      </motion.div>
      <div className="relative z-10">{children}</div>
    </section>
  );
};

/** 
 * Physics-based entrance reveal.
 */
export const FadeIn: React.FC<BaseProps & { delay?: number; direction?: 'up' | 'down' | 'none' }> = ({ children, delay = 0, direction = 'up', className = "" }) => {
  const variants: Variants = {
    hidden: { opacity: 0, y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      transition={{ duration: 1.2, delay, ease: [0.19, 1, 0.22, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/** 
 * Governance profile card.
 */
export const AuthorCard: React.FC<AuthorCardProps> = ({ name, role, bio, socials, index }) => (
  <motion.article 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.8 }}
    className="flex flex-col items-center p-16 bg-white dark:bg-stone-800/40 backdrop-blur-3xl rounded-[4rem] border border-stone-200 dark:border-stone-800 shadow-2xl hover:-translate-y-4 transition-all duration-700 text-center group"
  >
    <div className="w-24 h-24 rounded-[2rem] bg-fusion-bolt/10 flex items-center justify-center text-fusion-bolt font-serif text-5xl mb-12 transition-all group-hover:scale-110 group-hover:bg-fusion-bolt group-hover:text-white shadow-inner">
      {name.charAt(0)}
    </div>
    <h3 className="font-serif text-3xl text-stone-900 dark:text-stone-100 mb-3 tracking-tight">{name}</h3>
    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-400 group-hover:text-fusion-bolt transition-colors">{role}</p>
  </motion.article>
);