
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';

// Layout & UI
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/ui/Library';
import { HeroSection } from './components/sections/HeroSection';
import { MainContent } from './components/sections/MainContent';
import { ChatAssistant } from './components/ai/ChatAssistant';
import { WorkflowDocsSection } from './components/sections/WorkflowDocsSection';
import { PipelineEditorSection } from './components/sections/PipelineEditorSection';
import { SystemTasksSection } from './components/sections/SystemTasksSection';

// Hooks & Services
import { useTheme } from './hooks/useTheme';
import { useNavigation } from './hooks/useNavigation';
import { ContentService } from './services/contentService';
import { CityProvider } from './context/CityContext';

/**
 * App Component
 * 
 * The central orchestrator for the FlashFusion Architectural Dashboard.
 */
const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { isScrolled, scrollToSection } = useNavigation();

  const sections = useMemo(() => ({
    hero: ContentService.getSection('hero'),
    intro: ContentService.getSection('introduction'),
    arch: ContentService.getSection('infrastructure'),
    integ: ContentService.getSection('integration'),
    invest: ContentService.getSection('investment'),
    roadmap: ContentService.getSection('roadmap'),
    governance: ContentService.getSection('governance'),
    team: ContentService.getGovernanceTeam()
  }), []);

  return (
    <CityProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-fusion-bolt/20 transition-colors duration-1000 antialiased">
          <Navbar 
            scrolled={isScrolled} 
            isDarkMode={isDarkMode} 
            toggleTheme={toggleTheme} 
            menuOpen={isMenuOpen} 
            setMenuOpen={setIsMenuOpen} 
            scrollToSection={scrollToSection} 
          />

          <main role="main">
            <HeroSection 
              content={sections.hero}
              nextSectionId={sections.intro.id}
              scrollToSection={scrollToSection}
            />

            <MainContent 
              introContent={sections.intro}
              archContent={sections.arch}
              integrationContent={sections.integ}
              investmentContent={sections.invest}
              roadmapContent={sections.roadmap}
              governanceContent={sections.governance}
              governanceTeam={sections.team}
              scrollToSection={scrollToSection}
            />

            {/* Platform Feature Enhancements */}
            <SystemTasksSection />
            <WorkflowDocsSection />
            <PipelineEditorSection />
          </main>
          
          <ChatAssistant />
          <Footer />
        </div>
      </ErrorBoundary>
    </CityProvider>
  );
};

export default App;
