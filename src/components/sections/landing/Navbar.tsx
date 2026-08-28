'use client';


import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Menu } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const headerBgColor = '#4A90E2';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeAnd = (fn: () => void) => {
    setMenuOpen(false);
    setTimeout(fn, 150);
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleAboutClick = () => {
    if (pathname === '/') {
      const aboutSection = document.getElementById('about-us');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push('/#about-us');
    }
  };

  const handleFeaturesClick = () => {
    if (pathname === '/') {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push('/#features');
    }
  };

  return (
    <header
      style={{
        backgroundColor: scrolled ? '#fff' : headerBgColor,
        color: scrolled ? '#222' : '#fff',
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.10)' : '0 4px 16px rgba(0, 0, 0, 0.18)',
        transition: 'background 0.3s, color 0.3s, box-shadow 0.3s',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
      className={`w-full ${scrolled ? 'text-black' : 'text-white'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div
          className={`text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity ${scrolled ? 'text-black' : 'text-white'} flex items-center gap-2`}
          onClick={handleHomeClick}
        >
          <Image 
            src="/ICPEPLogo.webp" 
            alt="ICPEP Logo" 
            width={45} 
            height={45}
            className="object-contain"
          />
          <X size={16} strokeWidth={2.5} className={scrolled ? 'text-black/60' : 'text-white/80'} aria-hidden="true" />
          <Image
            src="/CiscoLogo.webp"
            alt="Cisco Logo"
            width={70}
            height={35}
            className="object-contain h-[35px] w-auto"
          />
          FrameIt
        </div>

        <nav className="hidden md:flex space-x-6 items-center">
          <button onClick={handleAboutClick} className={`transition-colors text-base font-medium cursor-pointer ${scrolled ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-200'}`}>About Us</button>
          <button onClick={handleFeaturesClick} className={`transition-colors text-base font-medium cursor-pointer ${scrolled ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-200'}`}>Features</button>
          <button onClick={handleHomeClick} className={`transition-colors text-base font-medium cursor-pointer ${scrolled ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-200'}`}>Home</button>
        </nav>

        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-black hover:bg-black/5' : 'text-white hover:bg-white/10'}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="relative w-6 h-6 block">
            <Menu className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${menuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
            <X className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${menuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
          </span>
        </button>
      </div>

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 top-16 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-16 right-0 bottom-0 w-[min(78vw,320px)] bg-white shadow-2xl z-50 md:hidden flex flex-col p-6 gap-2 border-l border-black/5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {[
          { label: 'Home', action: handleHomeClick },
          { label: 'About Us', action: handleAboutClick },
          { label: 'Features', action: handleFeaturesClick },
        ].map((item, i) => (
          <button
            key={item.label}
            onClick={() => closeAnd(item.action)}
            className="text-left w-full px-4 py-3 rounded-xl text-base font-medium text-gray-800 hover:bg-[#4A90E2]/10 hover:text-[#4A90E2] transition-all duration-300"
            style={{
              transitionDelay: menuOpen ? `${80 + i * 60}ms` : '0ms',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateX(0)' : 'translateX(12px)',
            }}
          >
            {item.label}
          </button>
        ))}
        <div className="mt-auto pt-4 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-2 font-semibold text-gray-700">
          <Image src="/ICPEPLogo.webp" alt="" width={32} height={28} className="h-[22px] w-auto object-contain" />
          <X size={12} strokeWidth={2.5} className="text-gray-400" aria-hidden="true" />
          <Image src="/CiscoLogo.webp" alt="" width={40} height={22} className="h-[18px] w-auto object-contain" />
          FrameIt
        </div>
      </div>
    </header>
  );
}
