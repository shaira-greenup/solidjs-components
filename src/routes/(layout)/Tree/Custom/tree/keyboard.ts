import { Accessor } from "solid-js";
import { TreeNode, TreeSelectHandler, TreeFocusHandler, TreeExpandHandler } from "./types";
import { TREE_KEYBOARD_SHORTCUTS } from "./constants";

export interface KeyboardHandlers {
  handleSelect: TreeSelectHandler;
  handleFocus: TreeFocusHandler;
  handleExpand: TreeExpandHandler;
  handleCut: (nodeId: string) => void;
  handlePaste: (targetId: string) => void;
  handleMoveToRoot: () => void;
  clearCut: () => void;
  handleRename: (nodeId: string) => void;
  handleCreateNew: (parentId?: string) => void;
  handleDelete: (nodeId?: string) => void;
}

export const createKeyboardHandler = (
  flattenedNodes: Accessor<TreeNode[]>,
  focusedNode: Accessor<TreeNode | null>,
  currentNodeIndex: Accessor<number>,
  expandedNodes: Accessor<Set<string>>,
  handlers: KeyboardHandlers,
) => {
  return (e: KeyboardEvent): void => {
    const flattened = flattenedNodes();
    const currentNode = focusedNode();
    if (!currentNode) return;

    const currentIndex = currentNodeIndex();

    const actions = {
      focusDown: () => {
        e.preventDefault();
        if (currentIndex < flattened.length - 1) {
          const nextNode = flattened[currentIndex + 1];
          handlers.handleFocus(nextNode);
        }
      },

      focusUp: () => {
        e.preventDefault();
        if (currentIndex > 0) {
          const prevNode = flattened[currentIndex - 1];
          handlers.handleFocus(prevNode);
        }
      },

      handleArrowRight: () => {
        e.preventDefault();
        if (currentNode.hasChildren && !expandedNodes().has(currentNode.id)) {
          handlers.handleExpand(currentNode.id);
        } else if (
          currentNode.hasChildren &&
          expandedNodes().has(currentNode.id) &&
          flattened[currentIndex + 1]
        ) {
          const nextNode = flattened[currentIndex + 1];
          handlers.handleFocus(nextNode);
        }
      },

      handleArrowLeft: () => {
        e.preventDefault();
        if (currentNode.hasChildren && expandedNodes().has(currentNode.id)) {
          handlers.handleExpand(currentNode.id);
        } else if (currentNode.level > 0) {
          const parentLevel = currentNode.level - 1;
          for (let i = currentIndex - 1; i >= 0; i--) {
            if (flattened[i].level === parentLevel) {
              handlers.handleFocus(flattened[i]);
              break;
            }
          }
        }
      },

      handleHome: () => {
        e.preventDefault();
        if (flattened.length > 0) {
          handlers.handleFocus(flattened[0]);
        }
      },

      handleEnd: () => {
        e.preventDefault();
        if (flattened.length > 0) {
          handlers.handleFocus(flattened[flattened.length - 1]);
        }
      },

      handleSelect: () => {
        e.preventDefault();
        handlers.handleSelect(currentNode);
      },

      handleCut: () => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          handlers.handleCut(currentNode.id);
        }
      },

      handlePaste: () => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          handlers.handlePaste(currentNode.id);
        }
      },

      handleMoveToRoot: () => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
          e.preventDefault();
          handlers.handleMoveToRoot();
        }
      },

      handleEscape: () => {
        e.preventDefault();
        handlers.clearCut();
      },

      handleRename: () => {
        e.preventDefault();
        handlers.handleRename(currentNode.id);
      },

      handleCreateNew: () => {
        e.preventDefault();
        handlers.handleCreateNew(currentNode.id);
      },

      handleDelete: () => {
        e.preventDefault();
        handlers.handleDelete(currentNode.id);
      },
    };

    switch (e.key) {
      case "Home":
        actions.handleHome();
        break;
      case "End":
        actions.handleEnd();
        break;
      case "ArrowLeft":
        actions.handleArrowLeft();
        break;
      case "ArrowRight":
        actions.handleArrowRight();
        break;
      case "ArrowUp":
        actions.focusUp();
        break;
      case "ArrowDown":
        actions.focusDown();
        break;
      case "Enter":
      case " ":
        actions.handleSelect();
        break;
      case TREE_KEYBOARD_SHORTCUTS.CUT:
        actions.handleCut();
        break;
      case TREE_KEYBOARD_SHORTCUTS.PASTE:
        actions.handlePaste();
        break;
      case TREE_KEYBOARD_SHORTCUTS.ESCAPE:
        actions.handleEscape();
        break;
      case TREE_KEYBOARD_SHORTCUTS.MOVE_TO_ROOT:
      case TREE_KEYBOARD_SHORTCUTS.MOVE_TO_ROOT.toUpperCase():
        actions.handleMoveToRoot();
        break;
      case TREE_KEYBOARD_SHORTCUTS.RENAME:
        actions.handleRename();
        break;
      case TREE_KEYBOARD_SHORTCUTS.CREATE_NEW:
        actions.handleCreateNew();
        break;
      case TREE_KEYBOARD_SHORTCUTS.DELETE:
        actions.handleDelete();
        break;
    }
  };
};