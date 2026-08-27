"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface FramePreviewProps {
	frameUrl?: string;
	frameColor?: string;
	userImage?: string;
	userScale?: number;
	userRotate?: number;
	userImgPos?: { x: number; y: number };
	onImageDrag?: (pos: { x: number; y: number }) => void;
}

export default function FramePreview({
	frameUrl,
	frameColor = '#4A90E2',
	userImage,
	userScale = 100,
	userRotate = 0,
	userImgPos = { x: 0, y: 0 },
	onImageDrag
}: FramePreviewProps) {
	const [dragging, setDragging] = useState(false);
	const dragStateRef = useRef<{
		pointerId: number;
		startClientX: number;
		startClientY: number;
		startX: number;
		startY: number;
	} | null>(null);

	const handlePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
		if (!onImageDrag || !userImage) return;

		e.preventDefault();
		dragStateRef.current = {
			pointerId: e.pointerId,
			startClientX: e.clientX,
			startClientY: e.clientY,
			startX: userImgPos.x,
			startY: userImgPos.y,
		};
		setDragging(true);
		document.body.style.userSelect = 'none';
		document.body.style.cursor = 'grabbing';
	};

	useEffect(() => {
		if (!onImageDrag) return;

		const handlePointerMove = (event: PointerEvent) => {
			const dragState = dragStateRef.current;
			if (!dragState || event.pointerId !== dragState.pointerId) return;

			const dx = event.clientX - dragState.startClientX;
			const dy = event.clientY - dragState.startClientY;
			onImageDrag({
				x: dragState.startX + dx,
				y: dragState.startY + dy,
			});
		};

		const endDrag = (event: PointerEvent) => {
			const dragState = dragStateRef.current;
			if (!dragState || event.pointerId !== dragState.pointerId) return;

			dragStateRef.current = null;
			setDragging(false);
			document.body.style.userSelect = '';
			document.body.style.cursor = '';
		};

		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', endDrag);
		window.addEventListener('pointercancel', endDrag);

		return () => {
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('pointerup', endDrag);
			window.removeEventListener('pointercancel', endDrag);
			document.body.style.userSelect = '';
			document.body.style.cursor = '';
		};
	}, [onImageDrag]);

	return (
		<div className="flex flex-col items-center">
			<div 
				id="frame-preview"
				className="relative w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] md:w-[620px] md:h-[620px] shadow-2xl overflow-hidden md:ml-10"
				style={{
					backgroundColor: frameColor
				}}
			>
				<div className="absolute inset-0 flex items-center justify-center bg-white">
					   {userImage ? (
							<img
								src={userImage}
								alt="User uploaded"
								className="absolute select-none"
								style={{
									transform: `scale(${userScale / 100}) rotate(${userRotate}deg)`,
									transformOrigin: 'center',
									left: `${userImgPos.x}px`,
									top: `${userImgPos.y}px`,
									maxWidth: '100%',
									maxHeight: '100%',
									cursor: dragging ? 'grabbing' : 'grab',
									touchAction: 'none',
								}}
								onPointerDown={handlePointerDown}
								onDragStart={(event) => event.preventDefault()}
								draggable={false}
							/>
					   ) : (
						<div className="text-center text-gray-400">
							<div className="text-6xl mb-2">📷</div>
							<p className="text-sm">User photo will appear here</p>
						</div>
					)}
				</div>
				{frameUrl && (
					<div className="absolute inset-0 pointer-events-none z-10">
						<Image
							src={frameUrl}
							alt="Frame overlay"
							fill
							className="object-cover"
							priority
							sizes="(max-width: 680px) 100vw, 680px"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
