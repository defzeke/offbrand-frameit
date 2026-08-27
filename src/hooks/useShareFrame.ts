type UseShareFrameArgs = {
  imageUrl: string;
  templateName?: string;
  frameId: string | null | undefined;
  setFrameId: (id: string) => void;
};


type UseShareFrameResult = {
  handleShare: () => Promise<void>;
  showShareModal: boolean;
  setShowShareModal: (open: boolean) => void;
  shareUrl: string;
  loading: boolean;
};


export function useShareFrame({ imageUrl, templateName, frameId, setFrameId }: UseShareFrameArgs): UseShareFrameResult {
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateTempFrameId = () => {
    // Use template name as frame ID
    return templateName || 'name';
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    setLoading(true);
    let currentFrameId = frameId;
    if (!currentFrameId) {
      currentFrameId = generateTempFrameId();
      setFrameId(currentFrameId);
    }
    try {
      // Just generate the shareable URL without saving to database
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/${currentFrameId}`;
      setShareUrl(url);
      
      setShowShareModal(true);
    } catch (error) {
      console.error('Failed to create shareable link:', error);
      alert(`Failed to create shareable link: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return { handleShare, showShareModal, setShowShareModal, shareUrl, loading };
}
import { useState } from 'react';
