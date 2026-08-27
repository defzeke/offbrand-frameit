import { useState } from 'react';
import { downloadFrame } from '@/lib/downloadFrame';

export function useDownloadFrame() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSave = async () => {
    setIsDownloading(true);
    try {
      const success = await downloadFrame('frame-preview', {
        filename: `frameit-${Date.now()}`,
        format: 'png'
      });
      if (success) {
        console.log('Frame downloaded successfully');
      } else {
        alert('Failed to download frame. Please try again.');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download frame. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return { handleSave, isDownloading };
}
