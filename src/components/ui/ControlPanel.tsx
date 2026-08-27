"use client";
import { Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import YellowButton from './YellowButton';
import { useRichTextFormatting } from '../../hooks/useRichTextFormatting';
import { useEmojiPicker } from '../../hooks/useEmojiPicker';

interface ControlPanelProps {
	caption: string;
	onCaptionChange: (value: string) => void;
	onShare: () => void;
	backgroundColor?: string;
}

	export default function ControlPanel({
		caption,
		onCaptionChange,
		onShare,
		backgroundColor = '#4A90E2',
	}: ControlPanelProps) {
		const {
			richCaption,
			setRichCaption,
			editorRef,
			activeFormats,
			updateActiveFormats,
			handleInput,
			formatText,
		} = useRichTextFormatting(caption, onCaptionChange);

		const {
			showEmojiPicker,
			setShowEmojiPicker,
			handleEmojiSelect,
	} = useEmojiPicker((emoji) => formatText('insertText', emoji));

	const [copySuccess, setCopySuccess] = useState(false);
	const [showLinkInput, setShowLinkInput] = useState(false);
	const [linkUrl, setLinkUrl] = useState('');
	const [savedSelection, setSavedSelection] = useState<Range | null>(null);

	// Set initial content only once
	useEffect(() => {
			if (editorRef.current && caption && editorRef.current.innerHTML !== caption) {
				editorRef.current.innerHTML = caption;
				setRichCaption(caption);
			}
		}, [caption, editorRef, setRichCaption]);

		// Update format state on selection change
		useEffect(() => {
			const handler = () => updateActiveFormats();
			document.addEventListener('selectionchange', handler);
			return () => document.removeEventListener('selectionchange', handler);
		}, [updateActiveFormats]);

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
				A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫', E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰', J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵', O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺', T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿', Y: '𝒀', Z: '𝒁',
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

		const handleCopyAll = () => {
			if (editorRef.current) {
				const html = editorRef.current.innerHTML;
				const textToCopy = convertToUnicodeStyledText(html);
				let success = false;
				try {
					const textarea = document.createElement('textarea');
					textarea.value = textToCopy;
					document.body.appendChild(textarea);
					textarea.select();
					success = document.execCommand('copy');
					document.body.removeChild(textarea);
				} catch {
					success = false;
				}
				if (!success) {
					if (navigator.clipboard) {
						navigator.clipboard.writeText(textToCopy);
					} else {
						const textarea = document.createElement('textarea');
						textarea.value = textToCopy;
						document.body.appendChild(textarea);
						textarea.select();
						document.execCommand('copy');
						document.body.removeChild(textarea);
					}
				}
				setCopySuccess(true);
				setTimeout(() => setCopySuccess(false), 1200);
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
						onCaptionChange(editorRef.current.innerHTML);
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
				onCaptionChange(editorRef.current.innerHTML);
			}
		};

		return (
			<div>
				<h2 className="text-2xl font-bold mb-4 text-gray-800">Caption Writer</h2>
				<div 
					className="bg-white/80 rounded-3xl shadow-xl px-6 py-3 w-full min-h-[80px] min-w-[300px] border border-[#e0e7ef] backdrop-blur-md flex flex-col gap-6"
					style={{
						background: `linear-gradient(135deg, #fff 70%, ${backgroundColor}10 100%)`,
						boxShadow: '0 8px 32px 0 rgba(74,144,226,0.10), 0 1.5px 8px 0 rgba(80,227,194,0.08)'
					}}
				>
					{/* Formatting Toolbar */}
					<div className="flex flex-wrap gap-2 mb-2 items-center">
						<button
							type="button"
							className={`px-2 py-1 rounded border border-gray-300 text-lg font-bold ${activeFormats.bold ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
							title="Bold"
							onClick={() => formatText('bold')}
						>
							<b>B</b>
						</button>
						<button
							type="button"
							className={`px-2 py-1 rounded border border-gray-300 text-lg italic ${activeFormats.italic ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
							title="Italic"
							onClick={() => formatText('italic')}
						>
						<i>I</i>
					</button>
					{/* Emoji Picker */}
						<div className="relative">
							<button
								type="button"
								className="px-2 py-1 rounded border border-gray-300 text-lg bg-gray-100 hover:bg-gray-200"
								title="Insert Emoji"
								onClick={() => setShowEmojiPicker((v) => !v)}
							>
								😊
							</button>
							{showEmojiPicker && (
								<div className="absolute z-50 bg-white border border-gray-300 rounded shadow p-2 mt-1 flex flex-wrap gap-1 w-48"
									style={{ maxHeight: '180px', overflowY: 'auto' }}>
									{[  
									'🚀','💻','✨','📈','📊','📅','📌','📎','📚','📝','🔗','✅','❌','⚡','🎯','🏆','🔒','🔓','🛡️','🌟','💡','🕒','🔔','📢','📣','🗂️','🗃️','🗄️','📂','📁','🗑️','🔍','🔎','🔬','🔭','📡','🧭','🧑‍💻','👨‍💻','👩‍💻','🤝','🤲','🙌','👏','🙏','🤔','💬','🗨️','🗣️','👥','👤','👔','🧑‍💼','👨‍💼','👩‍💼','🏢','🏛️','🏫','🏦','🏨','🏥','🏪','🏬','🏭','🏗️','🛠️','⚙️','🧰','🧲','🔧','🔩','🪛','🪚','🛒','💳','💰','💵','💴','💶','💷','🧾','📄','📃','📑','📋','📆','📇','📉','📍','📏','📐','✂️','🖇️','📔','📕','📗','📘','📙','📓','📒','🗒️','🗞️','📰','🔖','🔏','🔐','🔑','🗝️','🔨','🪓','⛏️','⚒️','🗡️','⚔️','🔫','🚪','🪑','🛏️','🛋️','🚽','🚿','🛁','🪒','🧴','🧷','🧹','🧺','🧻','🪣','🧼','🪥','🧽','🧯','🚬','⚰️','🪦','⚱️','🗿','🪧','🪪','🪫','🪬','🪭','🪮','🪯','🪰','🪱','🪲','🪳','🪴','🪵','🪶','🪷','🪸','🪹','🪺','🪻','🪼','🪽','🪾','🪿','🫀','🫁','🫂','🫃','🫄','🫅','🫐','🫑','🫒','🫓','🫔','🫕','🫖','🫗','🫘','🫙','🫚','🫛','🫠','🫡','🫢','🫣','🫤','🫥','🫦','🫧','🫨','❤','🧡','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','💌','💤','💢','💥','💦','💨','💫','💬','💭','🗯️','💋','💍','💎','💐','💑','💒','💓','💔','💖','💗','💘','💙','💚','💛','💜','🖤','💝','💞','💟','❣️','💕','💌','💏','💍','💎','💐','💑','💒'
									].map((emoji, idx) => (
											<button
												key={emoji + idx}
												type="button"
												className="text-xl hover:bg-gray-200 rounded p-1"
												onClick={() => handleEmojiSelect(emoji)}
											>
												{emoji}
											</button>
										))}
								</div>
							)}
						</div>
					</div>
					{/* Link Input Modal */}
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
					{/* Rich Text Editor */}
					<div className="relative w-full mb-4">
						{/* Copy All button */}
						<button
							type="button"
							className="absolute top-2 right-2 p-1 rounded bg-white z-20 flex items-center justify-center min-w-[48px]"
							onClick={handleCopyAll}
							title={copySuccess ? 'Copied!' : 'Copy as Unicode styled text'}
							style={{ boxShadow: 'none', border: 'none' }}
							>
							<Copy size={14} className={copySuccess ? 'text-green-600' : 'text-gray-700'} />
							{copySuccess && <span className="ml-1 text-green-600 text-xs font-semibold">Copied!</span>}
						</button>
					<div
						ref={editorRef}
						className="w-full p-2 rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none resize-none text-gray-700 bg-white min-h-[200px] min-w-[200px] text-base"
						contentEditable
						suppressContentEditableWarning
						onInput={handleInput}
						onPaste={handlePaste}
						onClick={handleEditorClick}
						style={{ whiteSpace: 'pre-wrap', position: 'relative', zIndex: 1 }}
					/>
						{/* Custom placeholder for rich text editor */}
						{(!richCaption || richCaption === '<br>') && (
							<div className="absolute left-0 top-0 p-4 text-gray-400 pointer-events-none select-none" style={{ zIndex: 0 }}>
								Enter your caption here...
							</div>
						)}
					</div>
					{/* Share Frame Button */}
					<YellowButton 
						size="md" 
						className="w-full py-3 text-base rounded-xl shadow-md hover:shadow-lg transition-all"
						onClick={onShare}
					>
						Share Frame
					</YellowButton>
				</div>
			</div>
		);
	}
