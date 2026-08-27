import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useUploadHandler(
  setImageFile: (file: File) => void,
  setCaption?: (caption: string) => void
) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileDrop = useCallback((file: File) => {
    setImageFile(file);
    // Clear caption when new image is uploaded
    if (setCaption) {
      setCaption('');
    }
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      router.push('/edit');
    }, 2000);
  }, [setImageFile, setCaption, router]);

  return { showSuccess, handleFileDrop };
}
