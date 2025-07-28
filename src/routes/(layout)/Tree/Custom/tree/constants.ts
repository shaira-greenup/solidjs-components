export const VIRTUAL_ROOT_ID = "__virtual_root__";

// Development flag to control tree refresh behavior after rename operations
// Set to false to disable full tree refresh during development/testing
// Don't strictly need it, unless the user puts stupid things in the tree
// item.
export const REFRESH_TREE_AFTER_RENAME = false;

export const TREE_KEYBOARD_SHORTCUTS = {
  EXPAND_COLLAPSE: ["ArrowLeft", "ArrowRight"],
  NAVIGATE: ["ArrowUp", "ArrowDown"],
  SELECT: ["Enter", " "],
  JUMP: ["Home", "End"],
  CUT: "x",
  PASTE: "v",
  ESCAPE: "Escape",
  MOVE_TO_ROOT: "r",
  RENAME: "F2",
  CREATE_NEW: "Insert",
  DELETE: "Delete"
} as const;

export const ANIMATION_CLASSES = {
  ENTER_ACTIVE: "transition-all duration-200 ease-in-out",
  ENTER: "opacity-0 max-h-0 -translate-y-2",
  ENTER_TO: "opacity-100 max-h-96 translate-y-0",
  EXIT_ACTIVE: "transition-all duration-200 ease-in-out",
  EXIT: "opacity-100 max-h-96 translate-y-0",
  EXIT_TO: "opacity-0 max-h-0 -translate-y-2"
} as const;
