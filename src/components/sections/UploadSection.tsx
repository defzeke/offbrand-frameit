"use client";

import Footer from '@/components/sections/Footer';
import { UploadCardModel } from '@/components/ui/UploadCardModel';
import { useFrame } from '@/contexts/FrameContext';
import { useUploadHandler } from '@/hooks/useUploadHandler';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUserDisplayName } from '@/hooks/useUserDisplayName';
import { getAllFrames, deleteFrame, SavedFrame } from '@/lib/frameStorage';
import FrameCard from '@/components/ui/FrameCard';
import YellowButton from '@/components/ui/YellowButton';
import { useRouter } from 'next/navigation';

export default function UploadSection() {
    const { imageFile, setImageFile, loadFrame, setCaption } = useFrame();
    const { showSuccess, handleFileDrop } = useUploadHandler(setImageFile, setCaption);
    const router = useRouter();
    const primaryBlue = '#4A90E2';
    const accentGreen = '#50E3C2';
    const displayName = useUserDisplayName();
    const [savedFrames, setSavedFrames] = useState<Record<string, SavedFrame>>({});
    const [deleting, setDeleting] = useState<string | null>(null);
    const [showGreeting, setShowGreeting] = useState(true);
    const [greetingVisible, setGreetingVisible] = useState(true);
    const [greetingIn, setGreetingIn] = useState(true);
    const [loading, setLoading] = useState(true);

    // Load frames on mount
    useEffect(() => {
        const loadFrames = async () => {
            setLoading(true);
            const frames = await getAllFrames();
            setSavedFrames(frames);
            setLoading(false);
        };
        loadFrames();
    }, []);

    // Edit handler for saved frames
    const handleEdit = (frame: SavedFrame) => {
        loadFrame({
            imageUrl: frame.imageUrl,
            scale: frame.scale,
            rotate: frame.rotate,
            caption: frame.caption,
            frameColor: frame.frameColor,
            templateName: frame.templateName || '',
            frameId: frame.frameId,
        });
        router.push('/edit');
    };

    // Delete handler for saved frames
    const handleDelete = async (frameId: string) => {
        setDeleting(frameId);
        try {
            const success = await deleteFrame(frameId);
            if (success) {
                const frames = await getAllFrames();
                setSavedFrames(frames);
            }
        } catch (error) {
            console.error('Failed to delete frame:', error);
        } finally {
            setDeleting(null);
        }
    };

    // Logout handler: call sign-out API and redirect
    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/sign-out', { method: 'GET' });
            if (res.redirected) {
                window.location.href = res.url;
            } else {
                window.location.href = '/';
            }
        } catch {
            window.location.href = '/';
        }
    };

    // Handle animation for greeting
    useEffect(() => {
        if (showGreeting) {
            setGreetingVisible(true);
            setGreetingIn(false);
            // Next tick, set to in
            setTimeout(() => setGreetingIn(true), 10);
        } else {
            setGreetingIn(false);
            // Wait for animation before unmounting
            const timeout = setTimeout(() => setGreetingVisible(false), 250);
            return () => clearTimeout(timeout);
        }
    }, [showGreeting]);

    return (
        <div className="min-h-screen flex flex-col font-sans relative overflow-hidden bg-gradient-to-b from-[#4A90E2] via-[#8CB8E8] to-white">
            {/* Top left greeting - beautified, now hideable and animated */}
            <div className="absolute top-16 left-8 z-30 flex items-center gap-2">
                <button
                    aria-label={showGreeting ? 'Hide greeting' : 'Show greeting'}
                    onClick={() => setShowGreeting((v) => !v)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white/70 border border-white/30 shadow hover:bg-white/90 transition-colors"
                    style={{ boxShadow: '0 2px 8px 0 rgba(74,144,226,0.10)' }}
                    type="button"
                >
                    {showGreeting ? <ChevronLeft size={22} className="text-blue-400" /> : <ChevronRight size={22} className="text-blue-400" />}
                </button>
                <div className="relative" style={{ minWidth: '0', width: '0', height: '0' }}>
                    {greetingVisible && (
                        <div
                            className={`absolute left-10 top-1/2 -translate-y-1/2 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg backdrop-blur-md border border-white/30 bg-white/60 transition-all duration-300 ease-in-out ${greetingIn ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-x-6 scale-95 pointer-events-none'}`}
                            style={{
                                boxShadow: '0 4px 24px 0 rgba(74,144,226,0.10)',
                                border: '1.5px solid rgba(255,255,255,0.25)',
                                minWidth: '260px',
                                maxWidth: '420px',
                            }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-blue-400" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="12" fill="#4A90E2" fillOpacity="0.15"/>
                                <path d="M12 12c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="#4A90E2"/>
                            </svg>
                            <div className="flex flex-col">
                                <span className="text-base font-semibold text-gray-800 tracking-tight">Hello{displayName ? `,` : ''}</span>
                                {displayName ? (
                                    <div className="flex flex-col items-start w-full" style={{maxWidth: '180px'}}>
                                        {(() => {
                                            const words = displayName.split(' ');
                                            const lines = [];
                                            let currentLine = '';
                                            for (const word of words) {
                                                if ((currentLine + ' ' + word).trim().length > 18 && currentLine.length > 0) {
                                                    lines.push(currentLine.trim());
                                                    currentLine = word;
                                                } else {
                                                    currentLine += (currentLine ? ' ' : '') + word;
                                                }
                                            }
                                            if (currentLine) lines.push(currentLine.trim());
                                            return lines.map((line, idx) => (
                                                <span key={idx} className="text-sm font-medium text-blue-600 w-full break-words">
                                                    {line}
                                                </span>
                                            ));
                                        })()}
                                    </div>
                                ) : (
                                    <span className="text-sm font-medium text-blue-600 truncate" style={{maxWidth: '180px'}}>
                                        Guest
                                    </span>
                                )}
                            </div>
                            {/* Logout text button */}
                            <button
                                onClick={handleLogout}
                                className="ml-4 text-xs font-medium text-red-500 hover:underline hover:text-red-600 transition-colors px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
                                style={{ background: 'none', border: 'none' }}
                                type="button"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
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
                    backgroundPosition: '0 0, 40px 40px, 80px 20px, 20px 60px, 60px 80px, 30px 30px'
                }}
            />

            {/* Floating decorative shapes */}
            <div 
                className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ 
                    backgroundColor: primaryBlue,
                    top: '15%',
                    left: '10%',
                    animation: 'floatSlow 12s ease-in-out infinite'
                }}
            />
            <div 
                className="absolute w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ 
                    backgroundColor: accentGreen,
                    bottom: '20%',
                    right: '10%',
                    animation: 'floatSlow 15s ease-in-out infinite 3s'
                }}
            />

            <main className="grow flex flex-col items-center justify-center px-4 py-2 relative z-10">
                {imageFile && showSuccess && (
                    <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg max-w-xl w-full text-center text-sm font-medium shadow-md transition-opacity duration-500">
                        Successfully selected: {imageFile.name} ({Math.round(imageFile.size / 1024)} KB). Redirecting...
                    </div>
                )}

                <UploadCardModel 
                    onFileDrop={handleFileDrop}
                    uploadedFile={imageFile}
                />

                {/* Saved Frames Section */}
                <div className="w-full max-w-4xl mx-auto mt-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Saved Frames</h2>
                    {loading ? (
                        <div className="text-gray-500 text-center py-8">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            Loading frames...
                        </div>
                    ) : Object.keys(savedFrames).length === 0 ? (
                        <div className="text-gray-500 text-center py-8">No saved frames found.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {Object.values(savedFrames).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(frame => (
                                <div key={frame.frameId} className="relative bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center">
                                    <FrameCard 
                                        title={frame.templateName || 'Untitled'}
                                        caption={frame.frameId}
                                        frameColor={frame.frameColor}
                                        imageUrl={frame.imageUrl}
                                    />
                                    <div className="mt-2 flex gap-2">
                                        <YellowButton 
                                            size="sm" 
                                            className="!rounded-lg px-3 py-1.5"
                                            onClick={() => handleEdit(frame)}
                                        >
                                            Edit
                                        </YellowButton>
                                        <YellowButton 
                                            size="sm" 
                                            className={`!rounded-lg px-3 py-1.5 ${deleting === frame.frameId ? 'opacity-50 cursor-wait' : ''}`}
                                            onClick={() => handleDelete(frame.frameId)}
                                            disabled={deleting === frame.frameId}
                                        >
                                            {deleting === frame.frameId ? 'Deleting...' : 'Delete'}
                                        </YellowButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
