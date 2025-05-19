import { useEffect, useState } from 'react';

// Type definition for the hotkey settings
type HotkeySettings = {
  keys: string[];
  callback: () => void;
  description: string;
};

// A custom hook for handling keyboard shortcuts
const useHotkeys = (hotkeys: HotkeySettings[]) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [activeHotkey, setActiveHotkey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keys when typing in input fields
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement) {
        return;
      }

      const key = e.key.toLowerCase();
      setPressedKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.add(key);
        return newKeys;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setPressedKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(key);
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Check for hotkey matches
  useEffect(() => {
    const keysArray = Array.from(pressedKeys);
    
    for (const hotkey of hotkeys) {
      // Sort keys alphabetically to ensure consistent matching regardless of order
      const sortedHotkeyKeys = [...hotkey.keys].sort().join('+');
      const sortedPressedKeys = [...keysArray].sort().join('+');
      
      if (sortedHotkeyKeys === sortedPressedKeys && keysArray.length > 0) {
        hotkey.callback();
        setActiveHotkey(sortedHotkeyKeys);
        
        // Reset active hotkey indication after 500ms
        setTimeout(() => {
          setActiveHotkey(null);
        }, 500);
        
        break;
      }
    }
  }, [pressedKeys, hotkeys]);

  return { activeHotkey };
};

export default useHotkeys;
