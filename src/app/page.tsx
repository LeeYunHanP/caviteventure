'use client';

import { useEffect } from 'react';
import ExhibitPro from '@/components/landingpage/exhibit';
import Hero from '@/components/landingpage/hero';
import LogoTicker from '@/components/landingpage/logoticker';
import MuseumShowcase from '@/components/landingpage/museumshowcase';

export default function Home() {
  useEffect(() => {
    fetch('/api/log-visitor', {
      method: 'POST',
    });
  }, []);

  return (
    <>
      <Hero />
      <LogoTicker />
      <MuseumShowcase />
      <ExhibitPro />
    </>
  );
}
