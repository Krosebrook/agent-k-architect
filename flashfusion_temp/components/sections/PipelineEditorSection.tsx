
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Sparkles, Plus, Play, ShieldCheck, Box, ChevronRight, Wand2 } from 'lucide-react';
import { FadeIn, Container } from '../ui/Library';

const PIPELINE_MODELS = {
  Node: {
    stages: ["Lint", "Test", "Build", "Push", "Deploy"],
    suggestion: "Optimized for high-concurrency Node environments. Added Vercel Edge caching layer."
  },
  Docker: {
    stages: ["Security Scan", "Build Image", "Registry Push", "K8s Deploy"],
    suggestion: "Heavier security focus. Vulnerability scanning added to pre-build stage."
  }
};

export const PipelineEditorSection: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<keyof typeof PIPELINE_MODELS | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const triggerAISuggestion = (model: keyof typeof PIPELINE_MODELS) => {
    setIsSuggesting(true);
    setTimeout(() => {
      setSelectedModel(model);
      setIsSuggesting(false);
    }, 1500);
  };

  return (
    <section id="pipeline-editor" className="py-32 bg-stone-950 border-t border-stone-900">
      <Container>
        <header className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">
          <FadeIn>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-fusion-bolt/10 text-fusion-bolt">
                <Settings2 size={24} />
              </div>
              <span className="text-xs font-bold tracking-[0.5em] uppercase text-stone-500">CI/CD Designer</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-white">Visual <span className="italic text-fusion-bolt">DAG</span> Editor</h2>
          </FadeIn>
          
          <div className="flex flex-col gap-6 bg-stone-900/40 p-10 rounded-[3rem] border border-stone-800 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles size={18} className="text-fusion-bolt" />
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-100">AI Setup Recommendations</span>
            </div>
            <div className="flex gap-4">
              {(Object.keys(PIPELINE_MODELS) as Array<keyof typeof PIPELINE_MODELS>).map(m => (
                <button
                  key={m}
                  onClick={() => triggerAISuggestion(m)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    selectedModel === m ? 'bg-fusion-bolt text-white' : 'bg-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  {m} Template
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="relative min-h-[500px] bg-stone-900/20 border border-stone-800 rounded-[4rem] p-12 overflow-hidden flex items-center justify-center">
          {/* Visual Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #FF6B6B 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <AnimatePresence mode="wait">
            {isSuggesting ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center gap-6"
              >
                <Wand2 size={48} className="text-fusion-bolt animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-fusion-bolt">Analyzing Architectural Context...</span>
              </motion.div>
            ) : selectedModel ? (
              <div className="flex flex-wrap items-center justify-center gap-8 relative z-10 w-full">
                {PIPELINE_MODELS[selectedModel].stages.map((stage, i) => (
                  <React.Fragment key={stage}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-stone-900 border border-stone-800 p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 min-w-[160px] group hover:border-fusion-bolt transition-all"
                    >
                      <div className="w-10 h-10 bg-stone-950 rounded-xl flex items-center justify-center text-stone-500 group-hover:text-fusion-bolt transition-colors">
                        <Box size={20} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-white">{stage}</span>
                      <ShieldCheck size={14} className="text-emerald-500 opacity-40" />
                    </motion.div>
                    {i < PIPELINE_MODELS[selectedModel].stages.length - 1 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 + 0.05 }}
                      >
                        <ChevronRight className="text-stone-800" size={32} />
                      </motion.div>
                    )}
                  </React.Fragment>
                ))}
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full mt-24 max-w-2xl bg-fusion-bolt/5 border border-fusion-bolt/20 p-8 rounded-[2.5rem] flex items-center gap-6"
                >
                  <Sparkles className="text-fusion-bolt shrink-0" size={32} />
                  <p className="text-sm text-stone-300 italic font-light">
                    {PIPELINE_MODELS[selectedModel].suggestion}
                  </p>
                </motion.div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-8 text-center max-w-md">
                <div className="w-20 h-20 border border-dashed border-stone-700 rounded-full flex items-center justify-center text-stone-700">
                  <Plus size={32} />
                </div>
                <div>
                  <h4 className="font-serif text-2xl text-stone-500 mb-4">No Pipeline Configured</h4>
                  <p className="text-sm text-stone-600">Select an AI template above to auto-generate a performant deployment logic.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};
