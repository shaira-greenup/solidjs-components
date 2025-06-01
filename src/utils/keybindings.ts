// Shared keybinding constants
export const SIDEBAR_TOGGLE_KEY = 'b';
export const SIDEBAR_TOGGLE_TOOLTIP = 'Toggle sidebar (Ctrl+B)';

export function isSidebarToggleKey(event: KeyboardEvent): boolean {
  return (event.ctrlKey || event.metaKey) && event.key === SIDEBAR_TOGGLE_KEY;
}
