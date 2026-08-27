import { useState, useRef, useCallback } from 'react';

export function useRichTextFormatting(initialValue: string, onChange: (value: string) => void) {
  const [richCaption, setRichCaption] = useState(initialValue || '');
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false });

  const updateActiveFormats = useCallback(() => {
    if (!window.getSelection) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const bold = document.queryCommandState('bold');
    const italic = document.queryCommandState('italic');
    setActiveFormats({ bold, italic });
  }, []);

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    setRichCaption(html);
    onChange(html);
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  const formatText = useCallback((command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      const html = editorRef.current.innerHTML;
      setRichCaption(html);
      onChange(html);
      updateActiveFormats();
    }
  }, [onChange, updateActiveFormats]);

  return {
    richCaption,
    setRichCaption,
    editorRef,
    activeFormats,
    updateActiveFormats,
    handleInput,
    formatText,
  };
}
