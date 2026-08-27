"use client";

import YellowButton from './YellowButton';
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIN_DIMENSION = 100;
const MAX_DIMENSION = 8000;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

// Inline CloudUploadIcon component
const CloudUploadIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
	<svg 
		xmlns="http://www.w3.org/2000/svg" 
		width="24" 
		height="24" 
		viewBox="0 0 24 24" 
		fill="none" 
		stroke="currentColor" 
		strokeWidth="2" 
		strokeLinecap="round" 
		strokeLinejoin="round"
		className={className}
	>
		<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a5 5 0 0 1 0 10H5a3 3 0 0 1-1-5.899Z" />
		<path d="M12 14v-4" />
		<path d="m9 13 3-3 3 3" />
	</svg>
);

export interface UploadCardModelProps {
	onFileDrop: (file: File) => void;
	uploadedFile: File | null;
}
export const UploadCardModel: React.FC<UploadCardModelProps> = ({ onFileDrop, uploadedFile }) => {
	const [isDragging, setIsDragging] = useState(false);
	const [statusMessage, setStatusMessage] = useState<string | null>(null);
	const [isValidating, setIsValidating] = useState(false);
	const router = useRouter();

	const fileName = uploadedFile?.name || null;

		const showStatus = (message: string, type: 'error' | 'success' = 'error') => {
			setStatusMessage(message);
			setTimeout(() => setStatusMessage(null), type === 'error' ? 4000 : 3000);
		};

		const getImageDimensions = useCallback((file: File): Promise<{ width: number; height: number }> => {
			return new Promise((resolve, reject) => {
				const img = new Image();
				const url = URL.createObjectURL(file);

				img.onload = () => {
					URL.revokeObjectURL(url);
					resolve({ width: img.width, height: img.height });
				};

				img.onerror = () => {
					URL.revokeObjectURL(url);
					reject(new Error('Failed to load image'));
				};

				img.src = url;
			});
		}, []);

		const validateFile = useCallback(async (file: File): Promise<boolean> => {
			if (!ALLOWED_TYPES.includes(file.type)) {
				showStatus('Invalid file type. Please upload JPG or PNG images only.');
				return false;
			}

			if (file.size > MAX_FILE_SIZE) {
				showStatus(`File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
				return false;
			}

			if (file.size === 0) {
				showStatus('File is empty. Please select a valid image.');
				return false;
			}

			try {
				const dimensions = await getImageDimensions(file);
				if (dimensions.width < MIN_DIMENSION || dimensions.height < MIN_DIMENSION) {
					showStatus(`Image too small. Minimum dimensions: ${MIN_DIMENSION}x${MIN_DIMENSION}px.`);
					return false;
				}

				if (dimensions.width > MAX_DIMENSION || dimensions.height > MAX_DIMENSION) {
					showStatus(`Image too large. Maximum dimensions: ${MAX_DIMENSION}x${MAX_DIMENSION}px.`);
					return false;
				}

				return true;
			} catch {
				showStatus('Failed to read image. Please try another file.');
				return false;
			}
		}, [getImageDimensions]);

	const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);


	const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);


	const handleDrop = useCallback(async (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		setIsDragging(false);

		const files = Array.from(e.dataTransfer.files);
        
		if (files.length === 0) return;
        
		if (files.length > 1) {
			showStatus('Please upload only one image at a time.');
			return;
		}

		const file = files[0];
		setIsValidating(true);
        
		const isValid = await validateFile(file);
		setIsValidating(false);
        
		if (isValid) {
			onFileDrop(file);
			setTimeout(() => {
				router.push('/edit');
			}, 1000);
		}
	}, [onFileDrop, validateFile, router]);

	const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
        
		setIsValidating(true);
		const isValid = await validateFile(file);
		setIsValidating(false);
        
		if (isValid) {
			onFileDrop(file);
			setTimeout(() => {
				router.push('/edit');
			}, 1000);
		}
        
		e.target.value = '';
	}, [onFileDrop, validateFile, router]);

	const ovalGradient = 'linear-gradient(90deg, #f0fdf4 0%, #ffffff 100%)';
    
	const dropZoneClasses = `
		w-full max-w-xl mx-auto p-10 md:p-12 
		border-4 rounded-[4rem] 
		flex flex-col items-center justify-center text-center 
		transition-all duration-300 ease-in-out
		shadow-2xl hover:shadow-3xl
		${isValidating
			? 'border-blue-400 bg-blue-50 text-blue-600 cursor-wait'
			: isDragging || fileName
			? 'border-teal-500 bg-teal-50 text-teal-600 scale-[1.01] cursor-pointer' 
			: 'border-gray-200 bg-white text-gray-400 cursor-pointer'
		}
	`;

	return (
		<div className="w-full px-4 py-6">
			{statusMessage && (
				<div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-xl z-50 transition-opacity duration-300">
					{statusMessage}
				</div>
			)}
            
			<label 
				htmlFor="file-upload"
				className={dropZoneClasses}
				style={{
					backgroundImage: isDragging || fileName ? undefined : ovalGradient,
					borderColor: isDragging || fileName ? 'rgb(13 148 136)' : '#e5e7eb',
				}}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<CloudUploadIcon className={`w-20 h-20 mb-4 ${isValidating ? 'text-blue-500 animate-pulse' : isDragging || fileName ? 'text-teal-500' : 'text-teal-400'}`} />
                
				<p className="text-2xl font-bold text-gray-700 mb-2">
					{isValidating ? 'Validating image...' : fileName ? `File Selected: ${fileName}` : 'Drag or Drop your Frame here'}
				</p>
				<p className={`text-xs ${isValidating ? 'text-blue-600' : isDragging || fileName ? 'text-teal-600' : 'text-gray-500'}`}>
					{isValidating ? 'Please wait...' : 'JPG or PNG only. Max 10MB. Min 100x100px.'}
				</p>
			</label>

			<input 
				id="file-upload"
				type="file" 
				accept=".jpg,.jpeg,.png"
				onChange={handleFileSelect} 
				className="hidden" 
			/>

			<div className="text-center mt-4">
				<YellowButton 
					size="md" 
					fullRounded={true}
					onClick={() => !isValidating && document.getElementById('file-upload')?.click()}
					className={isValidating ? 'opacity-50 cursor-not-allowed' : ''}
				>
					{isValidating ? 'Validating...' : 'Browse'}
				</YellowButton>
			</div>
		</div>
	);
};

export default UploadCardModel;
