"use client";

import { useFrame } from '@/contexts/FrameContext';
import Footer from '@/components/sections/Footer';
import FramePreview from '@/components/ui/FramePreview';
import ControlPanel from '@/components/ui/ControlPanel';
import React, { useState } from 'react';
import { useUserDisplayName } from '@/hooks/useUserDisplayName';
import YellowButton from '@/components/ui/YellowButton';
import ShareModal from '@/components/modals/ShareModal';
// import { useRouter } from 'next/navigation';
import { useShareFrame } from '@/hooks/useShareFrame';
import { useRedirectIfNoImage } from '@/hooks/useRedirectIfNoImage';
import { saveFrame, fileToBase64 } from '@/lib/frameStorage';


export default function EditSection() {
  // const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const templateBy = useUserDisplayName();
  const {
    imageUrl,
    scale,
    rotate,
    caption,
    frameColor,
    templateName,
    setTemplateName,
    frameId,
    setCaption,
    setFrameId,
  } = useFrame();

  useRedirectIfNoImage(imageUrl);
  const { handleShare, showShareModal, setShowShareModal, shareUrl, loading } = useShareFrame({
    imageUrl: imageUrl as string,
    templateName: templateName,
    frameId,
    setFrameId,
  });

  React.useEffect(() => {
    setShowLoading(loading);
  }, [loading]);

  const handleSave = async () => {
    if (!imageUrl || !frameId) return;
    setIsSaving(true);
    try {
      let imageData = imageUrl;
      if (imageUrl.startsWith('blob:')) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        imageData = await fileToBase64(blob as File);
      }
      const frameData = {
        frameId,
        imageUrl: imageData,
        scale,
        rotate,
        caption,
        frameColor: frameColor || '#4A90E2',
        templateName: templateName || 'name',
        createdAt: new Date().toISOString(),
      };
      const saved = await saveFrame(frameData);
      if (saved) {
        window.location.href = '/upload';
      }
    } catch (error) {
      console.error('Failed to save frame:', error);
      alert(`Failed to save frame: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const primaryBlue = frameColor || '#4A90E2';
  const accentGreen = '#50E3C2';

  const handleChangeFrame = () => {
    if (confirm('Do you want to upload a new frame? Current progress will be lost.')) {
      window.location.href = '/upload';
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden bg-gradient-to-b from-[#4A90E2] via-[#8CB8E8] to-white">
      {/* Decorative dots pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
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
          backgroundPosition: '0 0, 40px 40px, 80px 20px, 20px 60px, 60px 80px, 30px 30px',
        }}
      />

      {/* Floating decorative shapes */}
      <div
        className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          backgroundColor: primaryBlue,
          top: '15%',
          left: '10%',
          animation: 'floatSlow 12s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          backgroundColor: accentGreen,
          bottom: '20%',
          right: '10%',
          animation: 'floatSlow 15s ease-in-out infinite 3s',
        }}
      />

      <main className="grow flex items-center justify-center py-12 px-6 relative z-10">
        {showLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-400/60 via-white/40 to-yellow-200/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center border-2 border-blue-200 animate-fadeIn">
              <div className="relative mb-6">
                <div className="w-14 h-14 border-4 border-blue-500 border-t-yellow-400 border-b-yellow-400 border-l-blue-400 border-r-blue-400 rounded-full animate-spin"></div>
                <svg className="absolute top-2 left-2 w-10 h-10 text-yellow-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /></svg>
              </div>
              <span className="text-xl font-bold text-blue-700 mb-2 tracking-wide">Sharing your frame...</span>
              <span className="text-base text-gray-500">Please wait while we save and generate your link.</span>
            </div>
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
              }
              .animate-fadeIn {
                animation: fadeIn 0.3s ease;
              }
            `}</style>
          </div>
        )}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center gap-6">
              <FramePreview
                frameUrl={imageUrl || undefined}
                frameColor={primaryBlue}
              />
              <YellowButton size="lg" onClick={handleChangeFrame}>
                + Change Frame
              </YellowButton>
            </div>
            <div className="flex items-center justify-center lg:justify-center">
              <div className="w-full max-w-md flex flex-col gap-4 mb-20">
                {/* Template by input */}
                <div>
                  <label htmlFor="templateBy" className="block text-sm font-medium text-gray-700 mb-1">Template by</label>
                  <input
                    id="templateBy"
                    name="templateBy"
                    type="text"
                    className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                    placeholder="your org's name"
                    value={templateBy}
                    readOnly
                  />
                </div>
                {/* Template input (now below template by) */}
                <div>
                  <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                  <input
                    id="template"
                    name="template"
                    type="text"
                    className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                    placeholder="Enter template name"
                    value={templateName}
                    onChange={e => setTemplateName(e.target.value.replace(/\s+/g, '-'))}
                  />
                </div>
                {/* Caption writer */}
                <ControlPanel
                  caption={caption}
                  onCaptionChange={setCaption}
                  onShare={handleShare}
                  backgroundColor={primaryBlue}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setShowSaveButton(true);
        }}
        shareUrl={shareUrl}
      />
      {showSaveButton && (
        <div className="fixed bottom-8 right-8 z-40">
          <YellowButton
            size="lg"
            onClick={handleSave}
            disabled={isSaving}
            className="shadow-2xl"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </YellowButton>
        </div>
      )}
    </div>
  );
}
