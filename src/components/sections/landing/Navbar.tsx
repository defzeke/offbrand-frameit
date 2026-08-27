'use client';


import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const headerBgColor = '#4A90E2';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            src="/favicon.ico" 
            alt="FrameIt Logo" 
            width={35} 
            height={35}
            className="object-contain"
          />
          FrameIt
        </div>

        <nav className="flex space-x-6 items-center">
          <button onClick={handleAboutClick} className={`transition-colors text-base font-medium cursor-pointer ${scrolled ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-200'}`}>About Us</button>
          <button onClick={handleFeaturesClick} className={`transition-colors text-base font-medium cursor-pointer ${scrolled ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-200'}`}>Features</button>
          <button onClick={handleHomeClick} className={`transition-colors text-base font-medium cursor-pointer ${scrolled ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-200'}`}>Home</button>
        </nav>
      </div>
    </header>
  );
}
