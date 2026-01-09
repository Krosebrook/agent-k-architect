
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Github, Linkedin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { FadeIn, ParallaxSection, Container } from '../ui/Library';
import { SectionContent, AuthorProfile, AuthorCardProps } from '../../types';
import { useNavigation } from '../../hooks/useNavigation';

/**
 * Props for the GovernanceSection.
 */
interface GovernanceSectionProps {
  /** Content metadata for the governance section */
  content: SectionContent;
  /** List of governance board team profiles */
  team: readonly AuthorProfile[];
  /** Optional navigation handler passed from parent */
  scrollToSection?: (id: string) => (e: React.MouseEvent) => void;
}

/**
 * GovernanceSection Component
 * 
 * Displays the architectural board responsible for the integrity of the 
 * FlashFusion federated stack.
 */
export const GovernanceSection: React.FC<GovernanceSectionProps> = ({ 
  content, 
  team, 
  scrollToSection 
}) => (
  <ParallaxSection id={content.id} variant="light">
    <Container>
      <div className="text-center mb-24">
        <FadeIn>
          <div className="text-xs font-bold tracking-[0.4em] uppercase text-stone-400 mb-8">{content.tagline}</div>
          <h2 className="text-5xl md:text-8xl font-serif text-stone-900 dark:text-stone-100 mb-10">{content.title}</h2>
          <p className="text-2xl font-light text-stone-500 dark:text-stone-400 max-w-3xl mx-auto leading-relaxed">{content.description}</p>
        </FadeIn>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((author, i) => (
          <EnhancedAuthorCard 
            key={author.name} 
            {...author} 
            index={i} 
            scrollToSection={scrollToSection} 
          />
        ))}
      </div>
    </Container>
  </ParallaxSection>
);

const EnhancedAuthorCard: React.FC<AuthorCardProps & { scrollToSection?: (id: string) => (e: React.MouseEvent) => void }> = ({ 
  name, 
  role, 
  bio, 
  socials, 
  index, 
  scrollToSection: scrollToSectionProp 
}) => {
  const { scrollToSection: navHookScroll } = useNavigation();
  const effectiveScroll = scrollToSectionProp || navHookScroll;
  
  const handleLink = (url: string) => (e: React.MouseEvent) => {
    if (url === '#' || url.startsWith('#')) {
      e.preventDefault();
      effectiveScroll('infrastructure')(e);
    }
  };

  return (
    <motion.article 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="flex flex-col items-center p-10 bg-white dark:bg-stone-800/50 backdrop-blur-3xl rounded-[3rem] border border-stone-200 dark:border-stone-800 shadow-xl hover:-translate-y-3 transition-all duration-500 text-center group"
    >
      <div className="w-20 h-20 rounded-[1.5rem] bg-fusion-bolt/10 flex items-center justify-center text-fusion-bolt font-serif text-3xl mb-8 transition-transform group-hover:scale-110 shadow-inner">
        {name.charAt(0)}
      </div>
      <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mb-2">{name}</h3>
      <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-fusion-bolt mb-6">{role}</p>
      
      {bio && (
        <p className="text-sm text-stone-500 dark:text-stone-400 font-light leading-relaxed mb-8 flex-grow italic">
          "{bio}"
        </p>
      )}

      <div className="flex gap-4">
        {socials?.linkedin && (
          <a 
            href={socials.linkedin} 
            target={socials.linkedin.startsWith('http') ? "_blank" : "_self"} 
            onClick={handleLink(socials.linkedin)}
            className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 text-stone-400 hover:text-fusion-bolt transition-colors border border-stone-100 dark:border-stone-800"
          >
            <Linkedin size={18} />
          </a>
        )}
        {socials?.github && (
          <a 
            href={socials.github} 
            target={socials.github.startsWith('http') ? "_blank" : "_self"} 
            onClick={handleLink(socials.github)}
            className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 text-stone-400 hover:text-stone-100 transition-colors border border-stone-100 dark:border-stone-800"
          >
            <Github size={18} />
          </a>
        )}
        <button 
          onClick={effectiveScroll('infrastructure')}
          className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 text-stone-400 hover:text-fusion-bolt transition-colors border border-stone-100 dark:border-stone-800"
        >
          <ExternalLink size={18} />
        </button>
      </div>
    </motion.article>
  );
};
