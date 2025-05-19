import { useCallback, useEffect, useState } from 'react';

interface ContextMenuPosition {
  x: number;
  y: number;
}

interface UseContextMenuReturn {
  showMenu: boolean;
  position: ContextMenuPosition;
  handleContextMenu: (e: React.MouseEvent) => void;
  closeMenu: () => void;
}

/**
 * Custom hook for handling context menus (right-click)
 */
export const useContextMenu = (_p0: {}): UseContextMenuReturn => {
  const [showMenu, setShowMenu] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  }, []);

  const closeMenu = useCallback(() => {
    setShowMenu(false);
  }, []);

  useEffect(() => {
    // Close the context menu when clicking outside of it
    const handleClick = () => {
      setShowMenu(false);
    };

    if (showMenu) {
      document.addEventListener('click', handleClick);
    }

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [showMenu]);

  return { showMenu, position, handleContextMenu, closeMenu };
};

export default useContextMenu;
