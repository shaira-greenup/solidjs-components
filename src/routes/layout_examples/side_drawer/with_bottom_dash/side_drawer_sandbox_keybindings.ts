import { onMount, onCleanup } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";

interface LayoutState {
  drawer: {
    width: number;
    visible: boolean;
    isResizing: boolean;
    startX: number;
    startWidth: number;
  };
  topBar: {
    visible: boolean;
  };
  bottomDash: {
    visible: boolean;
  };
}

/**
 * Creates global keybindings for toggling layout elements.
 * 
 * These keybindings are GLOBAL - they work anywhere on the page regardless of
 * which element has focus. This is because we attach the event listener to the
 * document object, not to any specific element.
 * 
 * If you need keybindings that only work when a specific element is focused,
 * you would instead:
 * 1. Use a ref on that element
 * 2. Attach the event listener to that element
 * 3. Or check e.target in the handler to filter events
 */
export function createGlobalKeybindings(
  layoutState: LayoutState,
  setLayoutState: SetStoreFunction<LayoutState>
) {
  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // These will fire even if user is typing in an input field
      // Consider adding checks like: if (e.target instanceof HTMLInputElement) return;
      if (e.key === "1" || (e.ctrlKey && e.key === "1")) {
        setLayoutState('drawer', 'visible', !layoutState.drawer.visible);
      } else if (e.key === "2" || (e.ctrlKey && e.key === "2")) {
        setLayoutState('topBar', 'visible', !layoutState.topBar.visible);
      } else if (e.key === "3" || (e.ctrlKey && e.key === "3")) {
        setLayoutState('bottomDash', 'visible', !layoutState.bottomDash.visible);
      }
    };

    // Attaching to document makes these keybindings global
    document.addEventListener("keydown", handleKeyDown);
    
    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
    });
  });
}
