import { onCleanup } from "solid-js";
import type { Accessor } from "solid-js";
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

interface ResizeOptions {
  layoutState: LayoutState;
  setLayoutState: SetStoreFunction<LayoutState>;
  minWidth?: number;
  maxWidth?: number;
}

/**
 * A directive that adds resize functionality to an element.
 * This directive DOES interact with the element it's attached to,
 * making it a good use case for the `use` directive pattern.
 *
 * The element will respond to mouse and touch events to resize the drawer.
 *
 * NOTE: We don't need onMount here because directives are only executed
 * when the element is actually in the DOM. According to the Solid.js docs:
 * "Directives are functions that are called when the element is created
 * but before it is added to the DOM."
 *
 * Since the element is guaranteed to exist when this function runs,
 * we can immediately attach event listeners without waiting for mount.
 * This is different from component logic where one typically needs onMount
 * to ensure the DOM is ready.
 */
export function resizeHandle(el: HTMLElement, accessor: Accessor<ResizeOptions>) {
  const options = accessor();
  const MIN_WIDTH = options.minWidth ?? 200;
  const MAX_WIDTH = options.maxWidth ?? 1024;

  const handleMouseMove = (e: MouseEvent) => {
    if (!options.layoutState.drawer.isResizing) return;

    const deltaX = e.clientX - options.layoutState.drawer.startX;
    const newWidth = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, options.layoutState.drawer.startWidth + deltaX),
    );
    options.setLayoutState('drawer', 'width', newWidth);
  };

  const handleMouseUp = () => {
    options.setLayoutState('drawer', 'isResizing', false);
    if (document) {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!options.layoutState.drawer.isResizing) return;

    const deltaX = e.touches[0].clientX - options.layoutState.drawer.startX;
    const newWidth = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, options.layoutState.drawer.startWidth + deltaX),
    );
    options.setLayoutState('drawer', 'width', newWidth);
  };

  const handleTouchEnd = () => {
    options.setLayoutState('drawer', 'isResizing', false);
    if (document) {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    options.setLayoutState('drawer', {
      isResizing: true,
      startX: e.clientX,
      startWidth: options.layoutState.drawer.width
    });

    if (document) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    options.setLayoutState('drawer', {
      isResizing: true,
      startX: e.touches[0].clientX,
      startWidth: options.layoutState.drawer.width
    });

    if (document) {
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
      document.body.style.userSelect = "none";
    }
  };

  // Attach event listeners to the element
  el.addEventListener("mousedown", handleMouseDown);
  el.addEventListener("touchstart", handleTouchStart);

  onCleanup(() => {
    // Clean up element event listeners
    el.removeEventListener("mousedown", handleMouseDown);
    el.removeEventListener("touchstart", handleTouchStart);

    // Clean up any active document listeners
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  });
}

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      resizeHandle: ResizeOptions;
    }
  }
}
