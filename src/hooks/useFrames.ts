import { useEffect, useState } from 'react';
import { getAllFrames, SavedFrame } from '@/lib/frameStorage';

export function useFrames() {
  const [frames, setFrames] = useState<SavedFrame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFrames = async () => {
      try {
        const savedFrames = await getAllFrames();
        const framesArray = Object.values(savedFrames);
        setFrames(framesArray);
      } catch (error) {
        console.error('Failed to load frames:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFrames();
  }, []);

  return { frames, loading };
}
