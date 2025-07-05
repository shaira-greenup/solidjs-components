import { createSignal } from "solid-js";

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
}

export const useRadialMenu = () => {
  const [showMenu, setShowMenu] = createSignal(false);
  const [menuPosition, setMenuPosition] = createSignal({ x: 0, y: 0 });

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

  return {
    showMenu,
    menuPosition,
    openMenu,
    closeMenu,
    handleContextMenu,
  };
};
