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
 * Creates global keybindings for toggling layout elements and resizing sidebar.
 *
 * These keybindings are GLOBAL - they work anywhere on the page regardless of
 * which element has focus. This is because we attach the event listener to the
 * document object, not to any specific element.
 *
 * Keybindings:
 * - 1 or Ctrl+1: Toggle sidebar visibility
 * - 2 or Ctrl+2: Toggle top bar visibility
 * - 3 or Ctrl+3: Toggle bottom dash visibility
 * - [ or Ctrl+[: Decrease sidebar width (accessibility)
 * - ] or Ctrl+]: Increase sidebar width (accessibility)
 * - Shift+[ or Ctrl+Shift+[: Decrease sidebar width (large step)
 * - Shift+] or Ctrl+Shift+]: Increase sidebar width (large step)
 *
 * If you need keybindings that only work when a specific element is focused,
 * you would instead:
 * 1. Use a ref on that element
 * 2. Attach the event listener to that element
 * 3. Or check e.target in the handler to filter events
 */
export function createGlobalKeybindings(
  layoutState: LayoutState,
  setLayoutState: SetStoreFunction<LayoutState>,
  options?: {
    minWidth?: number;
    maxWidth?: number;
    smallStep?: number;
    largeStep?: number;
  },
) {
  const MIN_WIDTH = options?.minWidth ?? 200;
  const MAX_WIDTH = options?.maxWidth ?? 1024;
  // Big step, few key presses, this works well with animation, looks good and is simple
  const STEP = options?.smallStep ?? 96;

  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.contentEditable === "true"
      ) {
        return;
      }

      // Layout toggle keybindings
      if (e.key === "1" || (e.ctrlKey && e.key === "1")) {
        e.preventDefault();
        setLayoutState("drawer", "visible", !layoutState.drawer.visible);
      } else if (e.key === "2" || (e.ctrlKey && e.key === "2")) {
        e.preventDefault();
        setLayoutState("topBar", "visible", !layoutState.topBar.visible);
      } else if (e.key === "3" || (e.ctrlKey && e.key === "3")) {
        e.preventDefault();
        setLayoutState(
          "bottomDash",
          "visible",
          !layoutState.bottomDash.visible,
        );
      }

      // Sidebar resize keybindings
      else if (e.key === "[" || (e.ctrlKey && e.key === "[")) {
        e.preventDefault();
        const newWidth = Math.max(MIN_WIDTH, layoutState.drawer.width - STEP);
        setLayoutState("drawer", "width", newWidth);
      } else if (e.key === "]" || (e.ctrlKey && e.key === "]")) {
        e.preventDefault();
        const newWidth = Math.min(MAX_WIDTH, layoutState.drawer.width + STEP);
        setLayoutState("drawer", "width", newWidth);
      }
    };

    // Attaching to document makes these keybindings global
    document.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
    });
  });
}
