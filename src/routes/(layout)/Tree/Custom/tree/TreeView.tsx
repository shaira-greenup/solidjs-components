import { createMemo, For, onMount, splitProps, Suspense } from "solid-js";

import { TreeItem } from "./TreeItem";
import { VIRTUAL_ROOT_ID } from "./constants";
import { TreeContext } from "./context";
import { LoadingTreeItem } from "./LoadingTreeItem";
import {
  useTreeEffects,
  useTreeKeyboard,
  useTreeOperations,
  useTreeState,
} from "./hooks";
import { TreeContextValue, TreeViewProps, TreeViewRef } from "./types";

export type { TreeNode, TreeViewProps } from "./types";

export const TreeView = (props: TreeViewProps) => {
  const [local, others] = splitProps(props, ["class"]);

  let treeRef: HTMLUListElement | undefined;

  // Initialize hooks
  const state = useTreeState(others);
  const operations = useTreeOperations(state, others, {
    get treeRef() {
      return treeRef;
    },
  });
  const { handleKeyDown } = useTreeKeyboard(state, operations);

  // Setup effects (Auto Scrolling Etc.)
  useTreeEffects(state, operations, {
    get treeRef() {
      return treeRef;
    },
  });

  // Expose the TreeView's API to the parent component via the ref prop
  // This allows parent components to programmatically control the tree (expand/collapse nodes, focus items, etc.)
  const treeViewRef: TreeViewRef = {
    expandAll: operations.expandAll,
    collapseAll: operations.collapseAll,
    collapseAllExceptFocused: operations.collapseAllExceptFocused,
    collapseAllExceptSelected: operations.collapseAllExceptSelected,
    collapseSome: operations.collapseSome,
    foldCycle: operations.foldCycle,
    focusAndReveal: operations.focusAndReveal,
    cut: operations.handleCut,
    paste: operations.handlePaste,
    clearCut: operations.clearCut,
    refreshTree: operations.refreshTree,
    rename: operations.handleRename,
    createNew: operations.handleCreateNew,
    delete: operations.handleDelete,
  };

  onMount(() => {
    others.ref?.(treeViewRef);
  });

  // Create a memo of the state for helper functions used in the TreeItem child component
  // Memo is reactive, so re-render only when needed.
  const contextValue = createMemo(
    (): TreeContextValue => ({
      expandedNodes: state.expandedNodes,
      focusedNodeId: state.focusedNodeId,
      selectedNodeId: state.selectedNodeId,
      loadedChildren: state.loadedChildren,
      cutNodeId: state.cutNodeId,
      editingNodeId: state.editingNodeId,
      onSelect: operations.handleSelect,
      onFocus: operations.handleFocus,
      onExpand: operations.handleExpand,
      onChildrenLoaded: operations.handleChildrenLoaded,
      onCut: operations.handleCut,
      onPaste: operations.handlePaste,
      onMoveToRoot: operations.handleMoveToRoot,
      onRename: operations.handleRename,
      onRenameCommit: operations.handleRenameCommit,
      onRenameCancel: operations.handleRenameCancel,
      onContextMenu: others.onContextMenu,
      loadChildren: others.loadChildren,
    }),
  );

  // NOTE We use a context provider to avoid prop drilling
  return (
    <TreeContext.Provider value={contextValue()}>
      <ul
        ref={treeRef}
        class={`menu bg-base-200 rounded-box w-full h-96 overflow-y-auto flex-nowrap ${local.class || ""}`}
        role="tree"
        aria-label="Tree View"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <Suspense fallback={<LoadingTreeItem />}>
          <For each={state.loadedChildren().get(VIRTUAL_ROOT_ID) || []}>
            {(node) => <TreeItem node={{ ...node, level: 0 }} />}
          </For>
        </Suspense>
      </ul>
    </TreeContext.Provider>
  );
};
