
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Code2, GitMerge, ListChecks, ArrowRight } from 'lucide-react';
import { FadeIn, Container } from '../ui/Library';

const SAMPLE_DOCS = [
  {
    id: "WF-CORE-SYNC",
    name: "Core Sync Orchestrator",
    type: "Workflow",
    description: "Handles high-concurrency state propagation across the 7-domain federated fabric.",
    schema: {
      input: { "hubId": "HubId", "payload": "Record<string, any>", "priority": "number" },
      output: { "status": "200 | 500", "transactionId": "UUID" }
    },
    logic: [
      "Validate Hub Identity via RLS matrices.",
      "Enqueue packet in n8n primary relay.",
      "Dispatch secondary burst to Zapier nodes if latency > 200ms.",
      "Finalize record in Supabase Canonical store."
    ]
  },
  {
    id: "COMP-AUTH-GUARD",
    name: "AuthGuardEnclave",
    type: "WorkflowComponent",
    description: "Granular access control component utilizing Supabase RLS and custom claims.",
    schema: {
      input: { "userId": "string", "domain": "HubId" },
      output: { "allowed": "boolean", "scope": "string[]" }
    },
    logic: [
      "Fetch user claims from Auth Node.",
      "Match domain-level permissions.",
      "Return scoped authorization object."
    ]
  }
];

export const WorkflowDocsSection: React.FC = () => {
  return (
    <section id="workflow-docs" className="py-32 bg-stone-50 dark:bg-stone-950">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <FadeIn>
            <div className="text-xs font-bold tracking-[0.5em] uppercase text-fusion-bolt mb-6">Documentation Engine</div>
            <h2 className="text-5xl md:text-7xl font-serif text-stone-900 dark:text-stone-50">Neural <span className="italic">Manifest</span></h2>
          </FadeIn>
          <FadeIn delay={0.2} className="max-w-xl">
            <p className="text-lg text-stone-500 leading-relaxed font-light">
              Autonomous documentation synchronization. Every workflow and component is mapped, typed, and narrated in real-time.
            </p>
          </FadeIn>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {SAMPLE_DOCS.map((doc, i) => (
            <FadeIn key={doc.id} delay={i * 0.1}>
              <div className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[3rem] p-10 hover:shadow-4xl transition-all">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-fusion-bolt group-hover:bg-fusion-bolt group-hover:text-white transition-all">
                      {doc.type === 'Workflow' ? <GitMerge size={24} /> : <Code2 size={24} />}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-50">{doc.name}</h4>
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">{doc.type}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-stone-300 dark:text-stone-700">{doc.id}</span>
                </div>

                <p className="text-stone-500 mb-8 font-light leading-relaxed">{doc.description}</p>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <ListChecks size={16} className="text-fusion-bolt" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-900 dark:text-stone-100">Functional Logic</span>
                    </div>
                    <ul className="space-y-3">
                      {doc.logic.map((step, si) => (
                        <li key={si} className="flex gap-4 text-sm text-stone-500">
                          <span className="text-stone-200 dark:text-stone-800 font-mono">{si + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-100 dark:border-stone-800">
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-4">I/O Schema</span>
                    <pre className="text-[11px] font-mono text-fusion-bolt overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(doc.schema, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
};
