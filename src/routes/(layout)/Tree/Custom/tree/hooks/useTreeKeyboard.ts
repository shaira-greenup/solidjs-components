import { Accessor, createMemo } from "solid-js";
import { TreeNode } from "../types";
import { TreeState } from "./useTreeState";
import { TreeOperations } from "./useTreeOperations";
import { createKeyboardHandler } from "../keyboard";
import { flattenTree } from "../utils";
import { VIRTUAL_ROOT_ID } from "../constants";

export interface TreeKeyboardHandlers {
  handleKeyDown: (event: KeyboardEvent) => void;
}

export const useTreeKeyboard = (
  state: TreeState,
  operations: TreeOperations
): TreeKeyboardHandlers => {
  const flattenedNodes = createMemo(() => {
    const children = state.loadedChildren().get(VIRTUAL_ROOT_ID);
    return children
      ? flattenTree(children, 0, state.expandedNodes, state.loadedChildren)
      : [];
  });

  const currentNodeIndex = createMemo(() => {
    const currentNode = state.focusedNode();
    return currentNode
      ? flattenedNodes().findIndex((n) => n.id === currentNode.id)
      : -1;
  });

  const keyboardHandlers = {
    handleSelect: operations.handleSelect,
    handleFocus: operations.handleFocus,
    handleExpand: operations.handleExpand,
    handleCut: operations.handleCut,
    handlePaste: operations.handlePaste,
    handleMoveToRoot: operations.handleMoveToRoot,
    clearCut: operations.clearCut,
    handleRename: operations.handleRename,
    handleCreateNew: operations.handleCreateNew,
    handleDelete: operations.handleDelete,
  };

  const handleKeyDown = createKeyboardHandler(
    flattenedNodes,
    state.focusedNode,
    currentNodeIndex,
    state.expandedNodes,
    keyboardHandlers
  );

  return {
    handleKeyDown,
  };
};