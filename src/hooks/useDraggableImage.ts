import { useState, useRef, useEffect, useCallback } from 'react';

interface UseDraggableImageResult {
  userImgPos: { x: number; y: number };
  setUserImgPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  handleImgMouseDown: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
  dragging: boolean;
}

export function useDraggableImage() : UseDraggableImageResult {
  const [userImgPos, setUserImgPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  const handleImgMouseDown = useCallback((e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      offsetX: userImgPos.x,
      offsetY: userImgPos.y,
    };
    document.body.style.cursor = 'grabbing';
  }, [userImgPos]);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setUserImgPos({
        x: dragStart.current.offsetX + dx,
        y: dragStart.current.offsetY + dy,
      });
    };
    const handleMouseUp = () => {
      setDragging(false);
      dragStart.current = null;
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return { userImgPos, setUserImgPos, handleImgMouseDown, dragging };
}
