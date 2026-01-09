
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { IntroductionSection } from './IntroductionSection';
import { InfrastructureSection } from './InfrastructureSection';
import { IntegrationSection } from './IntegrationSection';
import { SimulationSection } from './SimulationSection';
import { InvestmentSection } from './InvestmentSection';
import { RoadmapSection } from './RoadmapSection';
import { GovernanceSection } from './GovernanceSection';
import { SectionContent, AuthorProfile } from '../../types';

/**
 * Props for the MainContent component.
 */
interface MainContentProps {
  /** Metadata for the introduction enclave */
  introContent: SectionContent;
  /** Metadata for the infrastructure/topology enclave */
  archContent: SectionContent;
  /** Metadata for the integration protocols enclave */
  integrationContent: SectionContent;
  /** Metadata for the resource efficiency/investment enclave */
  investmentContent: SectionContent;
  /** Metadata for the expansion roadmap */
  roadmapContent: SectionContent;
  /** Metadata for the governance board enclave */
  governanceContent: SectionContent;
  /** The list of profiles for the governance board team members */
  governanceTeam: readonly AuthorProfile[];
  /** Handler for smooth scrolling between different enclaves */
  scrollToSection: (id: string) => (e: React.MouseEvent) => void;
}

/**
 * MainContent Component
 * 
 * Acting as the primary layout orchestrator for the descriptive enclaves of the platform.
 * This component aggregates all narrative sections (Introduction, Infrastructure, Integration, 
 * Simulation, Investment, Roadmap, and Governance) into a coherent, scrollable experience.
 * 
 * @param props - Full stack of content data and navigation handlers.
 */
export const MainContent: React.FC<MainContentProps> = ({
  introContent,
  archContent,
  integrationContent,
  investmentContent,
  roadmapContent,
  governanceContent,
  governanceTeam,
  scrollToSection
}) => {
  return (
    <>
      <IntroductionSection content={introContent} />
      
      <InfrastructureSection 
        content={archContent} 
        scrollToSection={scrollToSection} 
      />
      
      <IntegrationSection content={integrationContent} />
      
      {/* Simulation Engine provides interactive "what-if" scenarios for the stack */}
      <SimulationSection /> 
      
      <InvestmentSection content={investmentContent} />
      
      <RoadmapSection 
        content={roadmapContent} 
        scrollToSection={scrollToSection} 
      />
      
      <GovernanceSection 
        content={governanceContent} 
        team={governanceTeam} 
        scrollToSection={scrollToSection}
      />
    </>
  );
};
