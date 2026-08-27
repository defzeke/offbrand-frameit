"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/sections/landing/Navbar';
import LandingFooter from '@/components/sections/landing/LandingFooter';
import AboutSection from '@/components/sections/landing/AboutSection';
import FeaturesSection from '@/components/sections/landing/FeaturesSection';
import HeroSection from '@/components/sections/landing/HeroSection';

export default function LandingPage() {
  const router = useRouter();
  const primaryBlue = '#4A90E2'; 
  const accentGreen = '#50E3C2';

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <HeroSection primaryBlue={primaryBlue} accentGreen={accentGreen} onGetStarted={handleGetStarted} />

      {/* About Section */}
      <AboutSection primaryBlue={primaryBlue} accentGreen={accentGreen} />

      {/* Features Section */}
      <FeaturesSection primaryBlue={primaryBlue} accentGreen={accentGreen} />

      <LandingFooter />
    </div>
  );
}