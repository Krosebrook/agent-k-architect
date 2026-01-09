/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useRef } from 'react';
import { motion, useTransform, useSpring, useScroll, useMotionTemplate } from 'framer-motion';
import { ArrowDown, Cpu, ShieldCheck } from 'lucide-react';
import { FadeIn } from '../ui/Library';
import { SectionContent } from '../../types';

// Lazy-loaded visual assets for performance
const HeroScene = React.lazy(() => import('../QuantumScene').then(m => ({ default: m.HeroScene })));

/**
 * Props for the HeroSection component.
 */
interface HeroSectionProps {
  /** The content metadata for the hero section (title, tagline, etc.) */
  content: SectionContent;
  /** The ID of the section to scroll to when the "Initialize" button is clicked */
  nextSectionId: string;
  /** High-performance scroll orchestration handler from useNavigation hook */
  scrollToSection: (id: string) => (e: React.MouseEvent) => void;
}

/**
 * HeroSection Component
 * 
 * Central entrance of the FlashFusion platform. 
 * Features physics-based parallax orchestration and 3D perspective scaling.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  content,
  nextSectionId,
  scrollToSection
}) => {
  const containerRef = useRef<HTMLElement>(null);
  
  // High-frequency scroll orchestration
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Optimized spring physics for smoother scroll tracking
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45, // Slightly stiffer for better responsiveness
    damping: 30,   // Increased damping to prevent overshoot
    restDelta: 0.001
  });

  // --- Parallax Orchestration ---
  
  // Background layer depth
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const bgOpacity = useTransform(smoothProgress, [0, 0.85], [1, 0]);
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.1]);

  // Tagline transformations
  const taglineY = useTransform(smoothProgress, [0, 0.25], [0, -60]);
  const taglineOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const taglineScale = useTransform(smoothProgress, [0, 0.2], [1, 0.9]);

  // Main title 3D perspective and scaling
  const titleY = useTransform(smoothProgress, [0, 1], [0, -180]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.55], [1, 0]);
  // Optimized: Scale down slightly as it moves away to enhance depth perception
  const titleScale = useTransform(smoothProgress, [0, 0.55], [1, 0.9]);
  const titleRotateX = useTransform(smoothProgress, [0, 1], [0, 20]);
  const titleBlur = useTransform(smoothProgress, [0, 0.5], [0, 12]);
  const titleFilter = useMotionTemplate`blur(${titleBlur}px)`;

  // Description parallax
  const descY = useTransform(smoothProgress, [0, 1], [0, 100]);
  const descOpacity = useTransform(smoothProgress, [0, 0.45], [1, 0]);
  const descScale = useTransform(smoothProgress, [0, 0.45], [1, 0.95]);

  // CTA Interactive depth
  const ctaY = useTransform(smoothProgress, [0, 0.35], [0, 120]);
  const ctaOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);

  return (
    <header 
      ref={containerRef} 
      className="relative h-screen flex items-center justify-center overflow-hidden bg-stone-50 dark:bg-stone-950 perspective-[2000px]"
    >
      {/* 3D Background Layer */}
      <motion.div 
        style={{ y: bgY, opacity: bgOpacity, scale: bgScale }} 
        className="absolute inset-0 z-0 will-change-transform"
      >
        <Suspense fallback={<div className="w-full h-full bg-stone-100 dark:bg-stone-900 animate-pulse" />}>
          <HeroScene scrollYProgress={scrollYProgress} />
        </Suspense>
      </motion.div>
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-stone-50/5 to-stone-50 dark:via-stone-950/20 dark:to-stone-950" />
      
      {/* Dynamic Telemetry HUD */}
      <motion.div 
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        className="absolute top-28 right-8 z-20 hidden 2xl:flex flex-col gap-3"
      >
        <div className="flex items-center justify-between w-56 px-5 py-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            <Cpu size={14} className="text-fusion-bolt" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-stone-400">TENSOR: ONLINE</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="flex items-center justify-between w-56 px-5 py-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            <ShieldCheck size={14} className="text-blue-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-stone-400">ISOLATION: 100%</span>
          </div>
        </div>
      </motion.div>

      {/* Primary UI Layer */}
      <div className="relative z-10 container px-6 mx-auto text-center perspective-[3000px] transform-style-3d">
        
        <motion.div 
          style={{ y: taglineY, opacity: taglineOpacity, scale: taglineScale }} 
          className="will-change-transform backface-hidden"
        >
          <FadeIn direction="none">
            <span className="inline-block px-12 py-4 border border-nobel-gold/40 text-nobel-gold text-[9px] tracking-[0.8em] uppercase font-black rounded-full mb-14 backdrop-blur-3xl shadow-5xl bg-white/5">
              {content.tagline}
            </span>
          </FadeIn>
        </motion.div>
        
        <motion.div 
          style={{ 
            y: titleY, 
            opacity: titleOpacity, 
            scale: titleScale, 
            rotateX: titleRotateX,
            filter: titleFilter
          }} 
          className="will-change-transform backface-hidden origin-center"
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9, y: 40 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="text-8xl md:text-9xl lg:text-[12rem] font-serif font-bold leading-[0.75] mb-10 tracking-tighter text-stone-900 dark:text-stone-100"
          >
            {content.title}
            <span className="block mt-12 text-2xl md:text-4xl lg:text-5xl font-normal italic text-stone-500 dark:text-stone-400 tracking-tight opacity-60">
              {content.subtitle}
            </span>
          </motion.h1>
        </motion.div>
        
        <motion.div 
          style={{ y: descY, opacity: descOpacity, scale: descScale }} 
          className="will-change-transform"
        >
          <FadeIn delay={0.35} className="max-w-4xl mx-auto mb-20">
            <p className="text-lg md:text-2xl lg:text-2xl font-light text-stone-600 dark:text-stone-300 leading-relaxed tracking-tight px-10">
              {content.description}
            </p>
          </FadeIn>
        </motion.div>
        
        <motion.div 
          style={{ y: ctaY, opacity: ctaOpacity }} 
          className="will-change-transform"
        >
          <FadeIn delay={0.6}>
            <button 
              onClick={scrollToSection(nextSectionId)}
              className="inline-flex flex-col items-center gap-12 text-[10px] font-black uppercase tracking-[0.6em] text-stone-400 hover:text-fusion-bolt transition-all group focus:outline-none"
              aria-label="Start Deep Scan"
            >
              <span className="group-hover:tracking-[0.9em] transition-all duration-1000">Initialize Core Scan</span>
              <motion.div 
                animate={{ 
                  y: [0, 10, 0],
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 0px 0px rgba(255,107,107,0)',
                    '0 20px 60px 5px rgba(255,107,107,0.2)',
                    '0 0 0px 0px rgba(255,107,107,0)'
                  ]
                }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="p-12 border rounded-[3rem] border-stone-200 dark:border-stone-800 group-hover:border-fusion-bolt transition-all bg-white/10 dark:bg-stone-900/40 backdrop-blur-3xl relative"
              >
                <motion.div 
                  className="absolute inset-0 bg-fusion-bolt/5 rounded-[3rem]" 
                  animate={{ opacity: [0, 0.4, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <ArrowDown size={40} strokeWidth={1} className="relative z-10 group-hover:text-fusion-bolt transition-colors" />
              </motion.div>
            </button>
          </FadeIn>
        </motion.div>
      </div>
    </header>
  );
};