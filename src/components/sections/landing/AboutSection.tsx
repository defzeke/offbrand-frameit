import Image from 'next/image';
import React from 'react';

const AboutSection = ({ primaryBlue = '#4A90E2', accentGreen = '#50E3C2' }) => (
  <section 
    id="about-us" 
    className="py-16 md:py-24 overflow-hidden scroll-mt-16 relative"
    style={{
      background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 50%, #ffffff 100%)',
    }}
  >
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, ${primaryBlue} 2px, transparent 2px),
          radial-gradient(circle at 80% 20%, ${accentGreen} 1.5px, transparent 1.5px),
          radial-gradient(circle at 30% 70%, ${accentGreen} 1px, transparent 1px),
          radial-gradient(circle at 75% 80%, ${primaryBlue} 2.5px, transparent 2.5px),
          radial-gradient(circle at 10% 90%, ${primaryBlue} 1.5px, transparent 1.5px),
          radial-gradient(circle at 90% 60%, ${accentGreen} 2px, transparent 2px)
        `,
        backgroundSize: '100px 100px, 150px 150px, 120px 120px, 180px 180px, 90px 90px, 110px 110px',
        backgroundPosition: '0 0, 40px 40px, 80px 20px, 20px 60px, 60px 80px, 30px 30px'
      }}
    />
    <div className="max-w-5xl w-full mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-x-12 relative z-10">
      <div className="relative w-full max-w-sm h-64 md:h-80 mb-10 md:mb-0 md:shrink-0 flex items-center justify-center">
        <div 
          style={{ 
            transform: 'translate(0px, 0px)',
            boxShadow: `0 15px 50px rgba(74, 144, 226, 0.5), 0 0 30px rgba(74, 144, 226, 0.3)`,
            animation: 'float 6s ease-in-out infinite 1s'
          }}
          className="absolute w-80 h-80 overflow-hidden"
        >
          <Image
            src="/duck.png"
            alt="FrameIt Preview"
            fill
            className="object-cover"
            sizes="320px"
            priority
          />
        </div>
        <div 
          className="absolute w-12 h-12 rounded-full opacity-60"
          style={{ 
            backgroundColor: primaryBlue,
            top: '-10px',
            right: '20px',
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-8 h-8 rounded-full opacity-70"
          style={{ 
            backgroundColor: accentGreen,
            bottom: '10px',
            left: '10px',
            animation: 'pulse 3s ease-in-out infinite 1.5s'
          }}
        />
      </div>
      <div className="text-center md:text-left md:max-w-md shrink-0"> 
        <h2 
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 italic leading-tight mb-4" 
          style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.4)' }} 
        >
          Turn 
          <span style={{ color: primaryBlue }} className="font-extrabold"> moments</span> into 
          <br />
          <span style={{ color: accentGreen }} className="font-extrabold">masterpieces</span> with 
          <br />
          just one frame.
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          FrameIt transforms your everyday photos into stunning visual stories. 
          Choose a frame, customize it your way, and share your creativity with the world.
        </p>
      </div>
    </div>
  </section>
);

export default AboutSection;
