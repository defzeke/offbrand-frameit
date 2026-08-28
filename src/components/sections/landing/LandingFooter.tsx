'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Instagram, Linkedin, Facebook, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import LinkChoiceModal from '@/components/modals/LinkChoiceModal';

export default function LandingFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [choicePlatform, setChoicePlatform] = useState<'facebook' | 'instagram' | 'linkedin'>('facebook');
  const openChoice = (platform: 'facebook' | 'instagram' | 'linkedin', e: React.MouseEvent) => {
    e.preventDefault();
    setChoicePlatform(platform);
    setChoiceOpen(true);
  };
  // const contactEmail = "contact@frameit.com";
  

  const scrollToSection = (sectionId: string) => {
    if (pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <footer
      style={{
        background: `linear-gradient(90deg, #4A90E2 0%, #50E3C2 100%)`,
        boxShadow: '0 -8px 24px -3px rgba(0, 0, 0, 0.18), 0 -4px 12px -4px rgba(0, 0, 0, 0.12)',
        borderTopLeftRadius: '2rem',
        borderTopRightRadius: '2rem',
        marginTop: '4rem',
      }}
      className="text-white pt-8 pb-3 px-2"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6 text-xs items-start">
          <div className="flex flex-col items-start h-full">
            <h3
              className="text-2xl font-extrabold text-white cursor-pointer hover:opacity-90 transition-opacity drop-shadow-lg tracking-wide mb-2 flex flex-col items-start gap-1.5"
              onClick={() => router.push('/')}
            >
              <span className="flex items-center gap-2">
                <Image src="/ICPEPLogo.webp" alt="ICPEP Logo" width={60} height={45} className="object-contain h-[36px] w-auto" />
                <X size={16} strokeWidth={2.5} className="text-white/80" aria-hidden="true" />
                <Image src="/CiscoLogo.webp" alt="Cisco Logo" width={70} height={35} className="object-contain h-[28px] w-auto bg-white/90 rounded-md px-1 py-0.5" />
              </span>
              <span className="inline-block bg-white/20 px-3 py-1 rounded-xl shadow-md">FrameIt</span>
            </h3>
            <span className="text-blue-100 text-xs mt-2 italic">Create. Frame. Share.</span>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-white/90 tracking-wide">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => router.push('/')} className="hover:text-yellow-200 transition-colors cursor-pointer font-medium">Home</button></li>
              <li><button onClick={() => scrollToSection('about-us')} className="hover:text-yellow-200 transition-colors cursor-pointer font-medium">About</button></li>
              <li><button onClick={() => scrollToSection('features')} className="hover:text-yellow-200 transition-colors cursor-pointer font-medium">Features</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-white/90 tracking-wide">Support</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.facebook.com/icpepse.pupmanila"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => openChoice('facebook', e)}
                  className="hover:text-yellow-200 transition-colors cursor-pointer font-medium"
                >
                  Report an Issue
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/icpepse.pupmanila"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => openChoice('facebook', e)}
                  className="hover:text-yellow-200 transition-colors cursor-pointer font-medium"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-white/90 tracking-wide">Contact Us</h4>
            <div className="flex gap-4 items-center mt-2">
              <a
                href="https://www.instagram.com/icpep.se_pup/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => openChoice('instagram', e)}
                className="hover:text-yellow-200 transition-colors cursor-pointer"
                title="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://www.facebook.com/icpepse.pupmanila"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => openChoice('facebook', e)}
                className="hover:text-yellow-200 transition-colors cursor-pointer"
                title="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://www.linkedin.com/company/icpepse-pupmanila/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => openChoice('linkedin', e)}
                className="hover:text-yellow-200 transition-colors cursor-pointer"
                title="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-200/40 py-3 text-center text-xs text-blue-50 tracking-wide">
          <span className="inline-block bg-white/10 px-3 py-1 rounded-lg shadow-sm">
            © {currentYear} <span className="font-bold">ICPEP SE - PUP Manila</span> <span className="opacity-80">×</span> <span className="font-bold">Cisco NetConnect - PUP Manila</span>. All rights reserved. | Designed for your story.
          </span>
        </div>
      </div>
      <LinkChoiceModal isOpen={choiceOpen} onClose={() => setChoiceOpen(false)} platform={choicePlatform} />
    </footer>
  );
}
