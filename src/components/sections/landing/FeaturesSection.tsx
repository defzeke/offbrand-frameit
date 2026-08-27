import React from 'react';
import FeatureCard from '../../ui/FeatureCard';
import { Wand2, Zap, Share2 } from 'lucide-react';

const FeaturesSection = ({ primaryBlue = '#4A90E2', accentGreen = '#50E3C2' }) => (
  <section 
    id="features" 
    className="py-16 md:py-20 scroll-mt-16 relative overflow-hidden"
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
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-black">
          Why <span style={{ color: primaryBlue }}>FrameIt</span> is Your Picture <span style={{ color: accentGreen }}>Essential</span>.
        </h2>
        <div className="flex items-center justify-center gap-2 mt-6">
          <div 
            className="h-1 w-16 rounded-full"
            style={{ backgroundColor: primaryBlue }}
          />
          <div 
            className="h-1 w-8 rounded-full"
            style={{ backgroundColor: accentGreen }}
          />
          <div 
            className="h-1 w-16 rounded-full"
            style={{ backgroundColor: primaryBlue }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="transform hover:scale-105 transition-transform duration-300">
          <FeatureCard
            title="Design Your Posts"
            description="Pick from a collection of stylish, ready-made frames to enhance your photos. No need to fuss with designs, your photos get a polished look instantly"
            icon={Wand2}
            borderColor={primaryBlue}
            iconColor={primaryBlue}
          />
        </div>
        <div className="transform hover:scale-105 transition-transform duration-300 md:mt-8">
          <FeatureCard
            title="Effortless"
            description="FrameIt makes it super easy to turn any photo into something unique. Just select a frame, write a caption, upload your picture, and you're done."
            icon={Zap}
            borderColor={accentGreen}
            iconColor={accentGreen}
          />
        </div>
        <div className="transform hover:scale-105 transition-transform duration-300">
          <FeatureCard
            title="Share Your Work"
            description="Show your framed photos with friends, family or online. The ready-made frames makes sharing your memories quick, fun, and eye-catching."
            icon={Share2}
            borderColor={primaryBlue}
            iconColor={primaryBlue}
          />
        </div>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
