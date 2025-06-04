import { createSignal, onMount, onCleanup } from "solid-js";

export interface SidebarResizeOptions {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange?: (width: number) => void;
}

export function useSidebarResize(options: SidebarResizeOptions = {}) {
  const {
    initialWidth = 256, // 16rem
    minWidth = 192,     // 12rem
    maxWidth = 384,     // 24rem
    onWidthChange,
  } = options;

  const [isResizing, setIsResizing] = createSignal(false);
  const [sidebarWidth, setSidebarWidth] = createSignal(initialWidth);
  const [showResizeHandle, setShowResizeHandle] = createSignal(false);

  // Update CSS variable when width changes
  const updateSidebarWidth = (width: number) => {
    setSidebarWidth(width);
    document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
    onWidthChange?.(width);
  };

  // Resize handlers
  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.classList.add('sidebar-resizing');
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing()) return;
    
    const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
    updateSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    if (!isResizing()) return;
    setIsResizing(false);
    document.body.classList.remove('sidebar-resizing');
  };

  const handleResize = () => {
    const isDesktop = window.innerWidth >= 1024;
    setShowResizeHandle(isDesktop);
  };

  onMount(() => {
    // Set initial resize handle visibility
    setShowResizeHandle(window.innerWidth >= 1024);
    
    // Set initial CSS variable
    updateSidebarWidth(initialWidth);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleResize);
    
    onCleanup(() => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      document.body.classList.remove('sidebar-resizing');
    });
  });

  return {
    isResizing,
    sidebarWidth,
    showResizeHandle,
    handleMouseDown,
    updateSidebarWidth,
  };
}