import { supabase } from './supabase/supabase';

export interface SavedFrame {
	frameId: string;
	imageUrl: string;
	imageData?: string;
	scale: number;
	rotate: number;
	caption: string;
	frameColor: string;
	templateName?: string;
	createdAt: string;
	userId?: string;
}

const STORAGE_BUCKET = 'frames-images';

// Helper to get current user ID from Supabase session
const getUserId = async (): Promise<string | null> => {
	try {
		const { data: { user } } = await supabase.auth.getUser();
		return user?.id || null;
	} catch {
		return null;
	}
};

const base64ToBlob = (base64: string): Blob => {
	const parts = base64.split(',');
	const contentType = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
	const raw = atob(parts[1]);
	const array = new Uint8Array(raw.length);
	for (let i = 0; i < raw.length; i++) {
		array[i] = raw.charCodeAt(i);
	}
	return new Blob([array], { type: contentType });
};

export const saveFrame = async (frame: SavedFrame): Promise<boolean> => {
	try {
		const userId = await getUserId();
		if (!userId) {
			console.error('User not authenticated');
			alert('Please log in to save frames');
			return false;
		}

		// Check if frame already exists
		const { data: existingFrame } = await supabase
			.from('frames')
			.select('id')
			.eq('frame_id', frame.frameId)
			.eq('user_id', userId)
			.single();

		// If creating a new frame (not updating), check frame count limit
		if (!existingFrame) {
			const { count, error: countError } = await supabase
				.from('frames')
				.select('*', { count: 'exact', head: true })
				.eq('user_id', userId);

			if (countError) {
				console.error('Failed to check frame count:', countError);
			} else if (count !== null && count >= 10) {
				alert('Frame limit reached! You can only have 10 saved frames. Please delete a frame before creating a new one.');
				return false;
			}
		}

		// Upload image to Supabase Storage
		let imageUrl = '';
		if (frame.imageUrl) {
			const blob = frame.imageUrl.startsWith('data:') 
				? base64ToBlob(frame.imageUrl)
				: await fetch(frame.imageUrl).then(r => r.blob());

			const fileExt = blob.type.split('/')[1] || 'png';
			const storagePath = `${userId}/${frame.frameId}.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from(STORAGE_BUCKET)
				.upload(storagePath, blob, { upsert: true });

			if (uploadError) {
				console.error('Failed to upload image:', uploadError);
				alert(`Storage error: ${uploadError.message}`);
				return false;
			}

			// Get public URL
			const { data: { publicUrl } } = supabase.storage
				.from(STORAGE_BUCKET)
				.getPublicUrl(storagePath);
			imageUrl = publicUrl;
		}

		// Save frame metadata to database
		if (existingFrame) {
		// Update existing
		const templateNameValue = frame.templateName || 'name';
		const { error: dbError } = await supabase
			.from('frames')
			.update({
				caption: frame.caption,
				image_url: imageUrl,
				template_name: templateNameValue,
				frame_id: templateNameValue,
				sharing: true,
			})
			.eq('id', existingFrame.id);			if (dbError) {
				console.error('Failed to update frame:', dbError);
				alert(`Database error: ${dbError.message}`);
				return false;
			}
		} else {
		// Insert new
		const templateNameValue = frame.templateName || 'name';
		const { error: dbError } = await supabase
			.from('frames')
			.insert({
				user_id: userId,
				caption: frame.caption,
				image_url: imageUrl,
				template_name: templateNameValue,
				sharing: true,
				frame_id: templateNameValue,
				created_at: frame.createdAt,
			});			if (dbError) {
				console.error('Failed to insert frame:', dbError);
				alert(`Database error: ${dbError.message}`);
				return false;
			}
		}

		return true;
	} catch (error) {
		console.error('Failed to save frame:', error);
		alert(`Error saving frame: ${error instanceof Error ? error.message : 'Unknown error'}`);
		return false;
	}
};

export const getFrame = async (frameId: string): Promise<SavedFrame | null> => {
	try {
		const { data, error } = await supabase
			.from('frames')
			.select('*')
			.eq('frame_id', frameId)
			.single();

		if (error || !data) {
			console.error('Failed to get frame:', error);
			return null;
		}

		return {
			frameId: data.frame_id,
			imageUrl: data.image_url,
			scale: 100, // Default values since not in DB
			rotate: 0,
			caption: data.caption || '',
			frameColor: '#4A90E2', // Default color
			createdAt: data.created_at,
			userId: data.user_id,
		};
	} catch (error) {
		console.error('Failed to get frame:', error);
		return null;
	}
};

export const getFramesByUserId = async (userId: string): Promise<SavedFrame[]> => {
	try {
		const { data, error } = await supabase
			.from('frames')
			.select('*')
			.eq('user_id', userId)
			.eq('sharing', true)
			.order('created_at', { ascending: false })
			.limit(6);

		if (error) {
			console.error('Failed to get frames by user:', error);
			return [];
		}

		return (data || []).map(record => ({
			frameId: record.frame_id,
			imageUrl: record.image_url,
			scale: 100,
			rotate: 0,
			caption: record.caption || '',
			frameColor: '#4A90E2',
			templateName: record.template_name || '',
			createdAt: record.created_at,
			userId: record.user_id,
		}));
	} catch (error) {
		console.error('Failed to get frames by user:', error);
		return [];
	}
};

export const getAllFrames = async (): Promise<Record<string, SavedFrame>> => {
	try {
		const userId = await getUserId();
		if (!userId) {
			console.error('User not authenticated');
			return {};
		}

		const { data, error } = await supabase
			.from('frames')
			.select('*')
			.eq('user_id', userId)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Failed to get frames:', error);
			return {};
		}

		const frames: Record<string, SavedFrame> = {};
		
		for (const record of data || []) {
			frames[record.frame_id] = {
				frameId: record.frame_id,
				imageUrl: record.image_url,
				scale: 100,
				rotate: 0,
				caption: record.caption || '',
				frameColor: '#4A90E2',
				templateName: record.template_name || '',
				createdAt: record.created_at,
				userId: record.user_id,
			};
		}

		return frames;
	} catch (error) {
		console.error('Failed to get frames:', error);
		return {};
	}
};

export const deleteFrame = async (frameId: string): Promise<boolean> => {
	try {
		const userId = await getUserId();
		if (!userId) {
			console.error('User not authenticated');
			return false;
		}

		// Get frame to find storage path from image_url
		const { data: frame } = await supabase
			.from('frames')
			.select('image_url')
			.eq('frame_id', frameId)
			.eq('user_id', userId)
			.single();

		// Delete image from storage (extract path from URL)
		if (frame?.image_url) {
			try {
				const url = new URL(frame.image_url);
				const pathParts = url.pathname.split('/');
				const storagePath = pathParts.slice(pathParts.indexOf(STORAGE_BUCKET) + 1).join('/');
				if (storagePath) {
					await supabase.storage
						.from(STORAGE_BUCKET)
						.remove([storagePath]);
				}
			} catch (urlError) {
				console.warn('Failed to parse storage path:', urlError);
			}
		}

		// Delete frame record from database
		const { error } = await supabase
			.from('frames')
			.delete()
			.eq('frame_id', frameId)
			.eq('user_id', userId);

		if (error) {
			console.error('Failed to delete frame:', error);
			return false;
		}

		return true;
	} catch (error) {
		console.error('Failed to delete frame:', error);
		return false;
	}
};

export const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			if (typeof reader.result === 'string') {
				resolve(reader.result);
			} else {
				reject(new Error('Failed to convert file to base64'));
			}
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
};

export const getStorageInfo = (): { used: number; total: number; frames: number } => {
	try {
		const frames = getAllFrames();
		const frameCount = Object.keys(frames).length;
		const dataSize = JSON.stringify(frames).length;
		const estimatedTotal = 5 * 1024 * 1024;
    
		return {
			used: dataSize,
			total: estimatedTotal,
			frames: frameCount
		};
	} catch (error) {
		console.error('Failed to get storage info:', error);
		return { used: 0, total: 5 * 1024 * 1024, frames: 0 };
	}
};
