import { useEffect, useState } from 'react';
import { getFrame, SavedFrame } from '@/lib/frameStorage';

export function useLoadFrame(frameId: string) {
  const [frame, setFrame] = useState<SavedFrame | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [userCaption, setUserCaption] = useState('');

  useEffect(() => {
    if (!frameId) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const loadFrame = async () => {
      try {
        const savedFrame = await getFrame(frameId);
        if (savedFrame) {
          setFrame(savedFrame);
          setUserCaption(savedFrame.caption);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Failed to load frame:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadFrame();
  }, [frameId]);

  return { frame, loading, notFound, userCaption, setUserCaption };
}
