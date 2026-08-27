
"use client";

import { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import YellowButton from '../ui/YellowButton';


interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

export default function ShareModal({ isOpen, onClose, shareUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Share2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Share Your Frame
        </h2>
        
        <p className="text-center text-gray-600 mb-6">
          Copy this link to share your framed image with others
        </p>

        {/* Link display with copy button */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <div className="flex-1 overflow-hidden">
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 underline truncate font-mono block"
            >
              {shareUrl}
            </a>
          </div>
          
          <button
            onClick={handleCopy}
            className={`shrink-0 p-2 rounded-lg transition-all duration-200 ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            aria-label="Copy link"
          >
            {copied ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Success message */}
        {copied && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 text-center font-medium">
              ✓ Link copied to clipboard!
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          
          <YellowButton
            size="md"
            onClick={handleCopy}
            className="flex-1"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </YellowButton>
        </div>
      </div>
    </div>
  );
}
