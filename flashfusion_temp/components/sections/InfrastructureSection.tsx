
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, ArrowUpRight } from 'lucide-react';
import { FadeIn, ParallaxSection, Container } from '../ui/Library';
import { HubArchitectureDiagram } from '../Diagrams';
import { SectionContent } from '../../types';
import { HUBS_DATA } from '../../data/content';

/**
 * Props for the InfrastructureSection.
 */
interface InfrastructureSectionProps {
  /** Content metadata for this section */
  content: SectionContent;
  /** Navigation handler for smooth enclave transitions */
  scrollToSection?: (id: string) => (e: React.MouseEvent) => void;
}

/**
 * InfrastructureSection Component
 * 
 * Visualizes the topological layout of the functional enclaves.
 * Highlights the core domains of the FlashFusion federated stack.
 */
export const InfrastructureSection: React.FC<InfrastructureSectionProps> = ({ 
  content, 
  scrollToSection 
}) => (
  <ParallaxSection id={content.id} variant="accent">
    <Container className="grid lg:grid-cols-2 gap-24 items-center">
      <div className="order-2 lg:order-1">
        <FadeIn delay={0.3}><HubArchitectureDiagram /></FadeIn>
      </div>
      <div className="order-1 lg:order-2">
        <FadeIn>
          <div className="inline-flex items-center gap-4 px-6 py-3 border rounded-2xl bg-white dark:bg-stone-900 shadow-xl mb-10">
            <Layers size={20} className="text-fusion-bolt" />
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-stone-500 dark:text-stone-300">{content.tagline}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif mb-10 text-stone-900 dark:text-stone-100 leading-tight">{content.title}</h2>
          <p className="text-xl font-light text-stone-600 dark:text-stone-400 leading-relaxed mb-16">{content.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HUBS_DATA.slice(0, 4).map(hub => {
              const targetId = hub.portalPath.replace('#', '');
              return (
                <a 
                  key={hub.id} 
                  href={hub.portalPath}
                  onClick={scrollToSection ? scrollToSection(targetId) : undefined}
                  className="group p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-fusion-bolt transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${hub.color} text-white`}>
                      <hub.icon size={20} />
                    </div>
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">{hub.label}</span>
                  </div>
                  <ArrowUpRight size={18} className="text-stone-300 group-hover:text-fusion-bolt transition-colors" />
                </a>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </Container>
  </ParallaxSection>
);
