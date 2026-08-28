import Image from 'next/image';
import { X } from 'lucide-react';

const BottomLabel: React.FC = () => {
    return (
        <footer className="w-full text-center text-xs text-gray-500 py-4 flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-1.5 text-gray-700 font-semibold">
                <span className="flex items-center gap-2">
                    <Image src="/ICPEPLogo.webp" alt="ICPEP Logo" width={60} height={40} className="object-contain h-[36px] w-auto" />
                    <X size={14} strokeWidth={2.5} className="text-gray-400" aria-hidden="true" />
                    <Image src="/CiscoLogo.webp" alt="Cisco Logo" width={56} height={28} className="object-contain h-[28px] w-auto" />
                </span>
                <span>FrameIt</span>
            </div>
            <div className="max-w-7xl mx-auto">
                © 2025 <span className="font-semibold">ICPEP SE - PUP Manila</span> <span className="text-gray-400">×</span> <span className="font-semibold">Cisco NetConnect - PUP Manila</span>. All rights reserved. | Designed for your story.
            </div>
        </footer>
    );
};
export default BottomLabel;