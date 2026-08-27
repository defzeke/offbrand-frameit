"use client";

import Image from 'next/image';

import { useRouter } from 'next/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useFrames } from '@/hooks/useFrames';

export default function CarouselSection() {
  const router = useRouter();
  const { frames, loading } = useFrames();

  const handleFrameClick = (frameId: string) => {
    router.push(`/${frameId}`);
  };

  if (loading) {
    return (
      <section className="bg-[#4A90E2] py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Try Out More!</h2>
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </section>
    );
  }

  if (frames.length === 0) {
    return (
      <section className="bg-[#4A90E2] py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Try Out More!</h2>
          <p className="text-white text-opacity-90">No frames available yet. Create your first frame to get started!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#4A90E2] py-10 px-6 mb-12">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-black mb-8 hover:text-[#FFD700] transition-all duration-300 cursor-default animate-pulse hover:animate-none hover:scale-110">Try Out More!</h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {frames.map((frame) => (
              <CarouselItem 
                key={frame.frameId} 
                className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5 cursor-pointer"
                onClick={() => handleFrameClick(frame.frameId)}
              >
                <div className="w-48 h-48 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white mx-auto">
                  <Image
                    src={frame.imageUrl}
                    alt={frame.caption || 'Frame'}
                    fill
                    className="object-cover hover:brightness-110 transition-all duration-300"
                    sizes="192px"
                    priority
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-[#FFD700] border-[#FFD700] hover:bg-[#FFD700] hover:text-black" />
          <CarouselNext className="text-[#FFD700] border-[#FFD700] hover:bg-[#FFD700] hover:text-black" />
        </Carousel>
      </div>
    </section>
  );
}
