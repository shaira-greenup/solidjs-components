import { createSignal, onCleanup } from 'solid-js';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
}

export const useRadialMenu = () => {
  const [showMenu, setShowMenu] = createSignal(false);
  const [menuPosition, setMenuPosition] = createSignal({ x: 0, y: 0 });
  const [longPressTimer, setLongPressTimer] = createSignal<number | null>(null);
  
  onCleanup(() => {
    const timer = longPressTimer();
    if (timer) clearTimeout(timer);
  });

  const openMenu = (x: number, y: number) => {
    setMenuPosition({ x, y });
    setShowMenu(true);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    openMenu(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    
    const timer = setTimeout(() => {
      const touch = e.touches[0];
      openMenu(touch.clientX, touch.clientY);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    const timer = longPressTimer();
    if (timer) {
      clearTimeout(timer);
      setLongPressTimer(null);
    }
  };

  return {
    showMenu,
    menuPosition,
    openMenu,
    closeMenu,
    handleContextMenu,
    handleTouchStart,
    handleTouchEnd,
  };
};
