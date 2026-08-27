import React from 'react';
import YellowButton from '../../ui/YellowButton';

interface HeroSectionProps {
  primaryBlue?: string;
  accentGreen?: string;
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ primaryBlue = '#4A90E2', accentGreen = '#50E3C2', onGetStarted }) => (
  <section 
    className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
    style={{
      background: 'linear-gradient(to bottom, #4A90E2 0%, #8CB8E8 50%, rgba(255, 255, 255, 1) 100%)',
    }}
  >
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: `
          radial-gradient(circle at top right, rgba(74, 144, 226, 0.9) 1px, transparent 1px),
          radial-gradient(circle at 70% 30%, rgba(74, 144, 226, 0.7) 1.5px, transparent 1.5px),
          radial-gradient(circle at 50% 60%, rgba(74, 144, 226, 0.3) 2px, transparent 2px),
          radial-gradient(circle at bottom center, rgba(255, 255, 255, 0.1) 2px, transparent 2px)
        `,
        backgroundSize: '15px 15px, 25px 25px, 40px 40px, 50px 50px',
        backgroundPosition: 'top right, 20% 20%, 50% 50%, bottom center'
      }}
    />
    {/* Floating decorative shapes */}
    <div 
      className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
      style={{ 
        backgroundColor: accentGreen,
        top: '5%',
        left: '10%',
        animation: 'heroFloat 12s ease-in-out infinite'
      }}
    />
    <div 
      className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl"
      style={{ 
        backgroundColor: primaryBlue,
        bottom: '20%',
        right: '15%',
        animation: 'heroFloat 15s ease-in-out infinite 3s'
      }}
    />
    {/* Geometric shapes */}
    <div 
      className="absolute w-32 h-32 opacity-10"
      style={{ 
        backgroundColor: accentGreen,
        top: '15%',
        right: '20%',
        transform: 'rotate(45deg)',
        animation: 'spin 20s linear infinite'
      }}
    />
    <div className="relative z-10 text-center px-6 -mt-20">
      {/* Decorative element above title */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div 
          className="h-0.5 w-12 rounded-full"
          style={{ backgroundColor: accentGreen }}
        />
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: accentGreen }}
        />
        <div 
          className="h-0.5 w-12 rounded-full"
          style={{ backgroundColor: accentGreen }}
        />
      </div>
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-black mb-6 leading-tight animate-fadeIn">
        Make it stand out.
        <br />
        <span
          style={{
            color: primaryBlue,
            fontWeight: 900,
            textShadow: '0 2px 8px #fff, 0 1px 0 #fff, 0 0px 2px #fff',
          }}
        >
          FrameIt
        </span> <span className="text-gray-900">now.</span>
      </h1>
      <p className="text-xl sm:text-2xl text-black mb-8 font-medium">
        Create, customize, and be post-ready.
      </p>
      {/* Enhanced button with glow effect */}
      <div className="relative inline-block">
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-50 pointer-events-none -z-10"
          style={{ backgroundColor: '#FFD700' }}
        />
        <YellowButton size="lg" onClick={onGetStarted} className="text-black">
          Get Started
        </YellowButton>
      </div>
    </div>
    <div 
      className="absolute bottom-0 left-0 right-0 h-32"
      style={{
        background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.8) 50%, white 100%)'
      }}
    />
  </section>
);

export default HeroSection;
