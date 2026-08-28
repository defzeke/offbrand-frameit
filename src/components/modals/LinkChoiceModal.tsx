"use client";

import { X, Facebook, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';

type Platform = 'facebook' | 'instagram' | 'linkedin';

interface LinkChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: Platform;
}

export default function LinkChoiceModal({ isOpen, onClose, platform }: LinkChoiceModalProps) {
  if (!isOpen) return null;

  const map: Record<Platform, { icpep: string; cisco: string; Icon: typeof Facebook }> = {
    facebook: { icpep: "https://www.facebook.com/icpepse.pupmanila", cisco: "https://www.facebook.com/cisconetconnectpup", Icon: Facebook },
    instagram: { icpep: "https://www.instagram.com/icpep.se_pup/", cisco: "https://www.instagram.com/cncp_mnl", Icon: Instagram },
    linkedin: { icpep: "https://www.linkedin.com/company/icpepse-pupmanila/posts/?feedView=all", cisco: "https://www.linkedin.com/company/cncp-mnl/posts/?feedView=all", Icon: Linkedin },
  };

  const { icpep, cisco, Icon } = map[platform];

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 px-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon size={24} className="text-[#4A90E2]" />
          </div>
        </div>

        <h2 className="text-lg font-bold text-center text-gray-900 mb-1">Choose Organization</h2>
        <p className="text-sm text-center text-gray-500 mb-6">Select which page to visit</p>

        <div className="grid grid-cols-2 gap-3">
          <a
            href={icpep}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-[#4A90E2] hover:bg-blue-50 transition-colors"
          >
            <Image src="/ICPEPLogo.webp" alt="ICPEP" width={48} height={36} className="h-[36px] w-auto object-contain" />
            <span className="text-sm font-semibold text-gray-700">ICPEP SE</span>
            <span className="text-xs text-gray-400">PUP Manila</span>
          </a>
          <a
            href={cisco}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-[#4A90E2] hover:bg-blue-50 transition-colors"
          >
            <Image src="/CiscoLogo.webp" alt="Cisco" width={56} height={28} className="h-[28px] w-auto object-contain" />
            <span className="text-sm font-semibold text-gray-700">Cisco NetConnect</span>
            <span className="text-xs text-gray-400">PUP Manila</span>
          </a>
        </div>
      </div>
    </div>
  );
}
