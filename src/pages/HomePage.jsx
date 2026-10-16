import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NeonDivider } from '../components/ui';
import Navigation from '../components/Navigation';
import HeroTerminal from '../components/HeroTerminal';
import ProjectsSection from '../components/ProjectsSection';
import StackSection from '../components/StackSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function HomePage() {
  const { hash } = useLocation();

  // Deep links like /#contact (used by the About page buttons)
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 350);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <>
      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main>
        {/* Section dividers between each section */}
        <HeroTerminal />

        <NeonDivider />
        <ProjectsSection />

        <NeonDivider className="my-16 sm:my-24 md:my-32" />
        <StackSection />

        <NeonDivider />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
