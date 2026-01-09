
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useNavigation Hook
 * 
 * Optimized for high-performance active section tracking and smooth scrolling.
 * Employs IntersectionObserver to minimize main-thread work during scroll.
 */
export const useNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sections = ['hero', 'introduction', 'infrastructure', 'integration', 'simulation', 'investment', 'roadmap', 'governance'];

  // Scroll visibility threshold for navbar state
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100 && !isScrolled) setIsScrolled(true);
      if (offset <= 100 && isScrolled) setIsScrolled(false);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // High-performance active section tracking
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Precise activation zone
      threshold: 0
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollToSection = useCallback((id: string) => (e?: React.MouseEvent | string) => {
    if (e && typeof e !== 'string') e.preventDefault();
    
    const targetId = typeof e === 'string' ? e : id;
    const target = document.getElementById(targetId);
    
    if (target) {
      const offset = 80; // Fixed offset for sticky navbar
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      setActiveSection(targetId);
    }
  }, []);

  return { isScrolled, activeSection, scrollToSection };
};
