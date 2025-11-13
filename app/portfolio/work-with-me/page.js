'use client';

import WorkHero from './WorkHero';
import ServicesSection from './ServicesSection';
import ProcessSection from './ProcessSection';

export default function WorkWithMe() {
  return (
    <div className="min-h-screen">
      <WorkHero />
      <ServicesSection />
      <ProcessSection />
    </div>
  );
}