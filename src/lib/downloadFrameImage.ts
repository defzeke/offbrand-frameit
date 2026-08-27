import { SavedFrame } from '@/lib/frameStorage';

interface DownloadFrameImageOptions {
  frame: SavedFrame;
  userImage: string;
  userImgPos: { x: number; y: number };
  userScale: number;
  userRotate: number;
  frameId: string;
  onStart?: () => void;
  onFinish?: () => void;
}

export async function downloadFrameImage({
  frame,
  userImage,
  userImgPos,
  userScale,
  userRotate,
  frameId,
  onStart,
  onFinish,
}: DownloadFrameImageOptions) {
  if (!frame) return;
  onStart?.();
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    const size = 1200;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = frame.frameColor || '#4A90E2';
    ctx.fillRect(0, 0, size, size);
    if (userImage) {
      const userImg = new Image();
      userImg.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        userImg.onload = resolve;
        userImg.onerror = reject;
        userImg.src = userImage;
      });

      const previewElement = document.getElementById('frame-preview');
      const previewSize = previewElement?.clientWidth || 620;
      const scaleFactor = size / previewSize;
      const sourceWidth = userImg.naturalWidth || userImg.width;
      const sourceHeight = userImg.naturalHeight || userImg.height;
      const fitScale = Math.min(1, previewSize / sourceWidth, previewSize / sourceHeight);
      const previewDrawWidth = sourceWidth * fitScale;
      const previewDrawHeight = sourceHeight * fitScale;
      const drawWidth = previewDrawWidth * scaleFactor;
      const drawHeight = previewDrawHeight * scaleFactor;
      const drawX = userImgPos.x * scaleFactor;
      const drawY = userImgPos.y * scaleFactor;

      ctx.save();
      ctx.translate(drawX + drawWidth / 2, drawY + drawHeight / 2);
      ctx.rotate((userRotate * Math.PI) / 180);
      ctx.scale(userScale / 100, userScale / 100);
      ctx.drawImage(userImg, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();
    }
    const frameImg = new Image();
    frameImg.crossOrigin = 'anonymous';
    await new Promise((resolve, reject) => {
      frameImg.onload = resolve;
      frameImg.onerror = reject;
      frameImg.src = frame.imageUrl;
    });
    ctx.drawImage(frameImg, 0, 0, size, size);
    canvas.toBlob((blob) => {
      if (!blob) {
        alert('Failed to create image');
        onFinish?.();
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `frameit-${frameId}.png`;
      link.click();
      URL.revokeObjectURL(url);
      onFinish?.();
    }, 'image/png');
  } catch (error) {
    console.error('Download error:', error);
    alert('Failed to download frame. Please try again.');
    onFinish?.();
  }
}
