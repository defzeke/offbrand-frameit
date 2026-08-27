"use client";

import { useRef, useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import YellowButton from './YellowButton';

// Slider component
interface SliderProps {
	label: string;
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
}

function Slider({
	label,
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1
}: SliderProps) {
	return (
		<div className="mb-4">
			<label className="block text-gray-700 text-sm font-medium mb-2">
				{label}: <span className="font-mono text-gray-900">{value}{label === 'Rotate' ? '°' : '%'}</span>
			</label>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className="w-full h-2 bg-gray-200 rounded appearance-none cursor-pointer focus:outline-none slider"
				style={{ accentColor: '#333' }}
			/>
			<style jsx>{`
				input[type='range'].slider::-webkit-slider-thumb {
					appearance: none;
					width: 16px;
					height: 16px;
					background: #fff;
					border: 2px solid #333;
					border-radius: 50%;
				}
				input[type='range'].slider::-moz-range-thumb {
					width: 16px;
					height: 16px;
					background: #fff;
					border: 2px solid #333;
					border-radius: 50%;
				}
				input[type='range'].slider::-ms-thumb {
					width: 16px;
					height: 16px;
					background: #fff;
					border: 2px solid #333;
					border-radius: 50%;
				}
				input[type='range'].slider::-webkit-slider-thumb:active {
					background: #eee;
				}
				input[type='range'].slider::-moz-range-thumb:active {
					background: #eee;
				}
				input[type='range'].slider::-ms-thumb:active {
					background: #eee;
				}
			`}</style>
		</div>
	);
}

// RichTextArea component with contentEditable
interface TextAreaProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

function TextArea({
	value,
	onChange,
	placeholder = "Enter your caption here..."
}: TextAreaProps) {
	const editorRef = useRef<HTMLDivElement>(null);
	const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false });
	const [showLinkInput, setShowLinkInput] = useState(false);
	const [linkUrl, setLinkUrl] = useState('');
	const [savedSelection, setSavedSelection] = useState<Range | null>(null);
	
	const handleInput = () => {
		if (editorRef.current) {
			onChange(editorRef.current.innerHTML);
		}
	};

	// Set initial content
	useEffect(() => {
		if (editorRef.current && value && editorRef.current.innerHTML !== value) {
			editorRef.current.innerHTML = value;
		}
	}, [value]);

	// Update format state on selection change
	const updateActiveFormats = () => {
		const selection = window.getSelection();
		if (!selection || !selection.rangeCount) return;
		
		const range = selection.getRangeAt(0);
		let node = range.commonAncestorContainer;
		if (node.nodeType === Node.TEXT_NODE) node = node.parentNode as Node;
		
		let bold = false;
		let italic = false;
		
		while (node && node !== editorRef.current) {
			if (node instanceof HTMLElement) {
				const tag = node.tagName;
				if (tag === 'B' || tag === 'STRONG') bold = true;
				if (tag === 'I' || tag === 'EM') italic = true;
			}
			node = node.parentNode as Node;
		}
		
		setActiveFormats({ bold, italic });
	};

	useEffect(() => {
		const handler = () => updateActiveFormats();
		document.addEventListener('selectionchange', handler);
		return () => document.removeEventListener('selectionchange', handler);
	}, []);

	const formatText = (command: string) => {
		document.execCommand(command, false);
		updateActiveFormats();
		if (editorRef.current) {
			onChange(editorRef.current.innerHTML);
		}
	};

	const handleInsertLink = () => {
		if (!linkUrl.trim()) {
			alert('Please enter a URL');
			return;
		}
		
		// Restore the saved selection
		if (savedSelection && editorRef.current) {
			const selection = window.getSelection();
			if (selection) {
				selection.removeAllRanges();
				selection.addRange(savedSelection);
				
				const selectedText = selection.toString();
				if (selectedText.trim()) {
					const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline;">${selectedText}</a>`;
					document.execCommand('insertHTML', false, linkHtml);
					
					if (editorRef.current) {
						onChange(editorRef.current.innerHTML);
					}
				}
			}
		}
		
		setShowLinkInput(false);
		setLinkUrl('');
		setSavedSelection(null);
	};

	const handleCancelLink = () => {
		setShowLinkInput(false);
		setLinkUrl('');
		setSavedSelection(null);
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const text = e.clipboardData.getData('text/plain');
		
		// URL regex pattern
		const urlPattern = /(https?:\/\/[^\s]+)/g;
		
		// Convert URLs to clickable links
		const htmlContent = text.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline;">$1</a>');
		
		// Insert the HTML at cursor position
		document.execCommand('insertHTML', false, htmlContent);
		
		// Update the caption state
		if (editorRef.current) {
			onChange(editorRef.current.innerHTML);
		}
	};
	
	const handleEditorClick = (e: React.MouseEvent) => {
		const target = e.target as HTMLElement;
		if (target.tagName === 'A') {
			e.preventDefault();
			const href = target.getAttribute('href');
			if (href) {
				window.open(href, '_blank', 'noopener,noreferrer');
			}
		}
	};
	
	return (
		<div className="relative w-full">
			{/* Formatting Toolbar */}
			<div className="flex gap-2 mb-2">
				<button
					type="button"
					className={`px-2 py-1 rounded border border-gray-300 text-sm font-bold ${activeFormats.bold ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
					title="Bold"
					onClick={() => formatText('bold')}
				>
					<b>B</b>
				</button>
				<button
					type="button"
					className={`px-2 py-1 rounded border border-gray-300 text-sm italic ${activeFormats.italic ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
					title="Italic"
					onClick={() => formatText('italic')}
				>
				<i>I</i>
			</button>
		</div>			{/* Link Input Modal */}
			{showLinkInput && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h3 className="text-lg font-bold mb-4">Insert Link</h3>
						<input
							type="url"
							value={linkUrl}
							onChange={(e) => setLinkUrl(e.target.value)}
							placeholder="Enter URL (e.g., https://example.com)"
							className="w-full p-2 border border-gray-300 rounded mb-4"
							autoFocus
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleInsertLink();
								if (e.key === 'Escape') handleCancelLink();
							}}
						/>
						<div className="flex gap-2">
							<button
								onClick={handleCancelLink}
								className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
							>
								Cancel
							</button>
							<button
								onClick={handleInsertLink}
								className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
							>
								Insert
							</button>
						</div>
					</div>
				</div>
			)}
			
			<div
				ref={editorRef}
				className="w-full p-2 rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-gray-700 bg-white min-h-[120px] text-base"
				contentEditable
				suppressContentEditableWarning
				onInput={handleInput}
				onPaste={handlePaste}
				onClick={handleEditorClick}
				style={{ whiteSpace: 'pre-wrap', position: 'relative', zIndex: 1 }}
			/>
			{(!value || value === '<br>') && (
				<div className="absolute left-0 top-0 p-2 text-gray-400 pointer-events-none select-none" style={{ zIndex: 0, marginTop: '38px' }}>
					{placeholder}
				</div>
			)}
		</div>
	);
}

// Main CustomizePanel component
interface CustomizePanelProps {
	frameColor: string;
	userScale: number;
	userRotate: number;
	onScaleChange: (value: number) => void;
	onRotateChange: (value: number) => void;
	userCaption: string;
	onCaptionChange: (value: string) => void;
	isDownloading: boolean;
	onDownload: () => void;
	captionCopied: boolean;
	onCopyCaption: (text: string) => void;
	templateBy?: string;
}

export default function CustomizePanel({
	frameColor,
	userScale,
	userRotate,
	onScaleChange,
	onRotateChange,
	userCaption,
	onCaptionChange,
	isDownloading,
	onDownload,
	captionCopied,
	onCopyCaption,
	templateBy = "Original Creator"
}: CustomizePanelProps) {
	// Unicode style maps
	const unicodeMaps = {
		bold: {
			A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜', J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧', U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
			a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
		} as Record<string, string>,
		italic: {
			A: '𝐴', B: '𝐵', C: '𝐶', D: '𝐷', E: '𝐸', F: '𝐹', G: '𝐺', H: '𝐻', I: '𝐼', J: '𝐽', K: '𝐾', L: '𝐿', M: '𝑀', N: '𝑁', O: '𝑂', P: '𝑃', Q: '𝑄', R: '𝑅', S: '𝑆', T: '𝑇', U: '𝑈', V: '𝑉', W: '𝑊', X: '𝑋', Y: '𝑌', Z: '𝑍',
			a: '𝑎', b: '𝑏', c: '𝑐', d: '𝑑', e: '𝑒', f: '𝑓', g: '𝑔', h: 'ℎ', i: '𝑖', j: '𝑗', k: '𝑘', l: '𝑙', m: '𝑚', n: '𝑛', o: '𝑜', p: '𝑝', q: '𝑞', r: '𝑟', s: '𝑠', t: '𝑡', u: '𝑢', v: '𝑣', w: '𝑤', x: '𝑥', y: '𝑦', z: '𝑧',
		} as Record<string, string>,
		boldItalic: {
			A: '𝑱', B: '𝑲', C: '𝑳', D: '𝑴', E: '𝑵', F: '𝑶', G: '𝑷', H: '𝑸', I: '𝑹', J: '𝑺', K: '𝑻', L: '𝑼', M: '𝑽', N: '𝑾', O: '𝑿', P: '𝒀', Q: '𝒁',
			a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆', f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋', k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐', p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕', u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚', z: '𝒛',
		} as Record<string, string>,
	};

	function convertToUnicodeStyledText(html: string) {
		const temp = document.createElement('div');
		temp.innerHTML = html;
		let result = '';
		
		function walk(node: Node, style: { bold?: boolean; italic?: boolean }) {
			if (node.nodeType === Node.TEXT_NODE) {
				let text = node.textContent || '';
				if (style.bold && style.italic) {
					text = text.split('').map(c => unicodeMaps.boldItalic[c] || c).join('');
				} else if (style.bold) {
					text = text.split('').map(c => unicodeMaps.bold[c] || c).join('');
				} else if (style.italic) {
					text = text.split('').map(c => unicodeMaps.italic[c] || c).join('');
				}
				result += text;
			}
			if (node.nodeType === Node.ELEMENT_NODE) {
				const el = node as HTMLElement;
				
				// Preserve links as plain URLs
				if (el.tagName === 'A') {
					const href = el.getAttribute('href');
					if (href) {
						result += href;
					}
					return; // Don't process children of <a> tags
				}
				
				// Preserve line breaks
				if (el.tagName === 'BR') {
					result += '\n';
					return;
				}
				
				// Preserve paragraph/div breaks
				if (el.tagName === 'DIV' || el.tagName === 'P') {
					if (result && !result.endsWith('\n')) {
						result += '\n';
					}
				}
				
				const nextStyle = { ...style };
				if (el.tagName === 'B' || el.tagName === 'STRONG') nextStyle.bold = true;
				if (el.tagName === 'I' || el.tagName === 'EM') nextStyle.italic = true;
				Array.from(el.childNodes).forEach(child => walk(child, nextStyle));
				
				// Add newline after block elements
				if ((el.tagName === 'DIV' || el.tagName === 'P') && !result.endsWith('\n')) {
					result += '\n';
				}
			}
		}
		walk(temp, {});
		return result.trim();
	}

	const handleCopyCaption = () => {
		const textToCopy = convertToUnicodeStyledText(userCaption);
		onCopyCaption(textToCopy);
	};

	return (
		<div className="w-full max-w-lg">
			<div
				className="rounded-3xl shadow-2xl p-10 flex flex-col border border-gray-200"
				style={{
					background: `linear-gradient(135deg, rgba(255,255,255,0.85) 60%, ${frameColor} 100%)`,
					backdropFilter: 'blur(16px)',
					WebkitBackdropFilter: 'blur(16px)',
					boxShadow: '0 8px 32px 0 rgba(74,144,226,0.12)',
					border: '1px solid rgba(255,255,255,0.25)',
				}}
			>
				<h2 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight drop-shadow-sm">
					Customize Frame
				</h2>

				<div className="space-y-6">
					<Slider
						label="Scale"
						value={userScale}
						onChange={onScaleChange}
						min={50}
						max={150}
						step={1}
					/>

					<Slider
						label="Rotate"
						value={userRotate}
						onChange={onRotateChange}
						min={0}
						max={360}
						step={1}
					/>
				</div>

				<div className="my-6">
					<YellowButton
						size="md"
						className={`w-full transition-all duration-200 ${isDownloading ? 'opacity-50 cursor-wait' : 'hover:scale-[1.03] hover:shadow-lg'}`}
						onClick={onDownload}
					>
						{isDownloading ? 'Downloading...' : 'Download Frame'}
					</YellowButton>
				</div>

				<div className="mb-4 relative">
					<button
						onClick={handleCopyCaption}
						className="absolute top-2 right-2 bg-white text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-all z-20 shadow"
						title="Copy caption"
						style={{ boxShadow: 'none', border: 'none' }}
					>
						{captionCopied ? (
							<Check size={16} className="text-green-600" />
						) : (
							<Copy size={16} />
						)}
					</button>
					<TextArea
						value={userCaption}
						onChange={onCaptionChange}
						placeholder="Edit caption..."
					/>
				</div>

				<div className="mt-4 p-4 bg-white/40 rounded-lg border border-gray-100">
					<p className="text-gray-700 text-sm text-center font-medium">
						Template by: <span className="font-semibold text-blue-600">{templateBy}</span>
					</p>
				</div>
			</div>
		</div>
	);
}
