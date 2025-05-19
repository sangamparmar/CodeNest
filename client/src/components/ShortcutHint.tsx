import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ShortcutHintProps = {
  shortcuts: {
    keys: string[];
    description: string;
  }[];
  activeHotkey: string | null;
};

const ShortcutHint: React.FC<ShortcutHintProps> = ({ shortcuts, activeHotkey }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShownInitially, setHasShownInitially] = useState(false);

  // Show shortcuts hint after a delay when the component first mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasShownInitially(true);
      
      // Auto-hide after some time
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 7000);
      
      return () => clearTimeout(hideTimer);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  // Show shortcuts whenever the h key is pressed
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && hasShownInitially) {
        setIsVisible(prevVisible => !prevVisible);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hasShownInitially]);

  // Highlight active hotkey
  const formatKeys = (keys: string[]) => {
    return keys.map((key, index) => (
      <React.Fragment key={key}>
        <span className="px-2 py-0.5 bg-black/30 rounded-md border border-white/10 text-xs font-mono">
          {key === ' ' ? 'Space' : key.toUpperCase()}
        </span>
        {index < keys.length - 1 && <span className="mx-1">+</span>}
      </React.Fragment>
    ));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 bg-black/70 backdrop-blur-lg border border-white/10 rounded-lg shadow-lg p-4 max-w-sm"
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-violet-300 font-medium">Keyboard Shortcuts</h4>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <motion.div 
                key={index}
                className={`flex justify-between items-center py-1.5 px-2 rounded ${
                  activeHotkey === shortcut.keys.sort().join('+') 
                    ? 'bg-violet-500/20 border border-violet-500/30' 
                    : ''
                }`}
                animate={
                  activeHotkey === shortcut.keys.sort().join('+')
                    ? {
                        backgroundColor: ['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0)'],
                        transition: { duration: 0.5 }
                      }
                    : {}
                }
              >
                <div className="text-sm text-gray-200">{shortcut.description}</div>
                <div className="flex items-center gap-1 ml-4">
                  {formatKeys(shortcut.keys)}
                </div>
              </motion.div>
            ))}

            <div className="border-t border-white/10 mt-3 pt-2 text-xs text-gray-400">
              Press <span className="px-1.5 py-0.5 bg-black/30 rounded border border-white/10 font-mono">?</span> to toggle shortcuts
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShortcutHint;
