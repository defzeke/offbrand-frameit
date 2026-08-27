import { useState } from 'react';

export function useEmojiPicker(onSelect: (emoji: string) => void) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiSelect = (emoji: string) => {
    onSelect(emoji);
    setShowEmojiPicker(false);
  };
  return {
    showEmojiPicker,
    setShowEmojiPicker,
    handleEmojiSelect,
  };
}
