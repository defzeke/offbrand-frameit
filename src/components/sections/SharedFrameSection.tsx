"use client";

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Footer from '@/components/sections/Footer';
import YellowButton from '@/components/ui/YellowButton';
import { downloadFrameImage } from '@/lib/downloadFrameImage';
import { useDraggableImage } from '@/hooks/useDraggableImage';
import { useLoadFrame } from '@/hooks/useLoadFrame';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import FramePreview from '@/components/ui/FramePreview';
import CustomizePanel from '@/components/ui/CustomizePanel';
import { getFramesByUserId, SavedFrame } from '@/lib/frameStorage';
import Image from 'next/image';

export default function SharedFrameSection() {
  const params = useParams();
  const router = useRouter();
  const frameId = params.frameId as string;
  const [userImage, setUserImage] = useState<string>('');
  const [userScale, setUserScale] = useState(100);
  const [userRotate, setUserRotate] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [creatorDisplayName, setCreatorDisplayName] = useState<string>('Original Creator');
  const [creatorFrames, setCreatorFrames] = useState<SavedFrame[]>([]);
  const { frame, loading, notFound, userCaption, setUserCaption } = useLoadFrame(frameId);
  const { copied: captionCopied, copy } = useCopyToClipboard();
  // File input handling (replaces useFileInput)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUserImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  const { userImgPos, setUserImgPos } = useDraggableImage();

  // Fetch creator's display name
  useEffect(() => {
    const fetchCreatorName = async () => {
      if (!frame?.userId) return;
      
      try {
        const response = await fetch(`/api/user-display-name-by-id?userId=${frame.userId}`);
        if (!response.ok) {
          console.warn('Failed to fetch creator display name');
          return;
        }
        const data = await response.json();
        if (data.display_name) {
          setCreatorDisplayName(data.display_name);
        }
      } catch (error) {
        console.error('Failed to fetch creator display name:', error);
      }
    };

    fetchCreatorName();
  }, [frame?.userId]);

  // Fetch more frames from the same creator
  useEffect(() => {
    const fetchCreatorFrames = async () => {
      if (!frame?.userId) return;
      
      try {
        const frames = await getFramesByUserId(frame.userId);
        // Filter out the current frame
        const otherFrames = frames.filter(f => f.frameId !== frameId);
        setCreatorFrames(otherFrames);
      } catch (error) {
        console.error('Failed to fetch creator frames:', error);
      }
    };

    fetchCreatorFrames();
  }, [frame?.userId, frameId]);

  const handleDownload = async () => {
    if (!frame) return;
    await downloadFrameImage({
      frame,
      userImage,
      userImgPos,
      userScale,
      userRotate,
      frameId,
      onStart: () => setIsDownloading(true),
      onFinish: () => setIsDownloading(false),
    });
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading frame...</p>
        </div>
      </div>
    );
  }

  const accentGreen = '#50E3C2';
  const primaryBlue = '#4A90E2';

  if (notFound || !frame) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{
        background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 50%, #ffffff 100%)',
      }}>
        {/* Decorative dots pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, ${primaryBlue} 2px, transparent 2px),
              radial-gradient(circle at 80% 20%, ${accentGreen} 1.5px, transparent 1.5px),
              radial-gradient(circle at 30% 70%, ${accentGreen} 1px, transparent 1px),
              radial-gradient(circle at 75% 80%, ${primaryBlue} 2.5px, transparent 2.5px)
            `,
            backgroundSize: '100px 100px, 150px 150px, 120px 120px, 180px 180px',
            backgroundPosition: '0 0, 40px 40px, 80px 20px, 20px 60px'
          }}
        />
        
        <main className="grow flex items-center justify-center px-6 relative z-10">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🖼️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Frame Not Found</h1>
            <p className="text-gray-600 mb-8">
              This frame doesn&apos;t exist or has been removed.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-x-hidden relative bg-gradient-to-b from-[#4A90E2] via-[#8CB8E8] to-white">
      {/* Decorative dots pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, ${frame.frameColor} 2px, transparent 2px),
            radial-gradient(circle at 80% 20%, ${accentGreen} 1.5px, transparent 1.5px),
            radial-gradient(circle at 30% 70%, ${accentGreen} 1px, transparent 1px),
            radial-gradient(circle at 75% 80%, ${frame.frameColor} 2.5px, transparent 2.5px),
            radial-gradient(circle at 10% 90%, ${frame.frameColor} 1.5px, transparent 1.5px),
            radial-gradient(circle at 90% 60%, ${accentGreen} 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px, 150px 150px, 120px 120px, 180px 180px, 90px 90px, 110px 110px',
          backgroundPosition: '0 0, 40px 40px, 80px 20px, 20px 60px, 60px 80px, 30px 30px'
        }}
      />

      {/* Floating decorative shapes */}
      <div 
        className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ 
          backgroundColor: frame.frameColor,
          top: '15%',
          left: '5%',
          animation: 'floatSlow 12s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ 
          backgroundColor: accentGreen,
          bottom: '20%',
          right: '5%',
          animation: 'floatSlow 15s ease-in-out infinite 3s'
        }}
      />

      <main className="grow py-12 px-6 relative z-10 flex items-center justify-center w-full">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Customize this Frame
            </h1>
            <p className="text-gray-600">
              Upload your photo and customize the frame template
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            <div className="flex flex-col items-center gap-6">
              <FramePreview
                frameUrl={frame.imageUrl}
                frameColor={frame.frameColor}
                userImage={userImage}
                userScale={userScale}
                userRotate={userRotate}
                userImgPos={userImgPos}
                onImageDrag={setUserImgPos}
              />
              <YellowButton
                size="lg"
                onClick={handleAddPhoto}
              >
                + Add Your Photo
              </YellowButton>
            </div>

            {/* Right: Customization Controls */}
            <div className="flex items-center justify-center lg:justify-end">
              <CustomizePanel
                frameColor={frame.frameColor}
                userScale={userScale}
                userRotate={userRotate}
                onScaleChange={setUserScale}
                onRotateChange={setUserRotate}
                userCaption={userCaption}
                onCaptionChange={setUserCaption}
                isDownloading={isDownloading}
                onDownload={handleDownload}
                captionCopied={captionCopied}
                onCopyCaption={copy}
                templateBy={creatorDisplayName}
              />
            </div>

          </div>

          {/* More frames from creator */}
          {creatorFrames.length > 0 && (
            <div className="mt-20 w-full">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                Try Out More Frames from {creatorDisplayName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {creatorFrames.map((creatorFrame) => (
                  <div
                    key={creatorFrame.frameId}
                    className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    onClick={() => router.push(`/${creatorFrame.frameId}`)}
                  >
                    <div className="relative w-full h-64">
                      <Image
                        src={creatorFrame.imageUrl}
                        alt={`Frame by ${creatorDisplayName}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 font-medium">
                        {creatorFrame.templateName || 'Untitled Frame'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </main>
      <Footer />
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
