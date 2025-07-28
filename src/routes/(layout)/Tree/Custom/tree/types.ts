import { Accessor } from "solid-js";

export interface TreeNode {
  id: string;
  label: string;
  hasChildren?: boolean;
  isExpanded?: boolean;
  level: number;
  type?: "folder" | "note";
}

export type TreeSelectHandler = (node: TreeNode) => void;
export type TreeFocusHandler = (node: TreeNode) => void;
export type TreeExpandHandler = (nodeId: string) => void;
export type TreeChildrenLoader = (nodeId: string) => Promise<TreeNode[]>;
export type TreeChildrenLoadedHandler = (
  nodeId: string,
  children: TreeNode[],
) => void;
export type TreeCutPasteHandler = (
  sourceId: string,
  targetId: string,
) => Promise<boolean>;
export type TreeRenameHandler = (
  nodeId: string,
  newLabel: string,
) => Promise<boolean>;
export type TreeCreateHandler = (parentId: string) => Promise<string | null>;
export type TreeDeleteHandler = (nodeId: string) => Promise<boolean>;
export type TreeContextMenuHandler = (
  node: TreeNode,
  event: MouseEvent,
) => void;


export interface TreeContextValue {
  expandedNodes: Accessor<Set<string>>;
  focusedNodeId: Accessor<string | undefined>;
  selectedNodeId: Accessor<string | undefined>;
  loadedChildren: Accessor<Map<string, TreeNode[]>>;
  cutNodeId: Accessor<string | undefined>;
  editingNodeId: Accessor<string | undefined>;
  onSelect: TreeSelectHandler;
  onFocus: TreeFocusHandler;
  onExpand: TreeExpandHandler;
  onChildrenLoaded: TreeChildrenLoadedHandler;
  onCut: (nodeId: string) => void;
  onPaste: (targetId: string) => void;
  onMoveToRoot: (nodeId?: string) => void;
  onRename: (nodeId: string) => void;
  onRenameCommit: (nodeId: string, newLabel: string) => void;
  onRenameCancel: () => void;
  onContextMenu?: TreeContextMenuHandler;
  loadChildren?: TreeChildrenLoader;
}

export interface TreeViewProps {
  loadChildren: TreeChildrenLoader;
  onSelect?: TreeSelectHandler;
  onFocus?: TreeFocusHandler;
  onExpand?: TreeExpandHandler;
  onMoveItemToNewParent?: TreeCutPasteHandler;
  onRename?: TreeRenameHandler;
  onCreate?: TreeCreateHandler;
  onDelete?: TreeDeleteHandler;
  onContextMenu?: TreeContextMenuHandler;
  class?: string;
  /**
   * Callback function that receives the TreeViewRef instance for programmatic control.
   * The ref provides access to tree operations like expand/collapse, cut/paste, and navigation.
   * Store the ref in a variable to call methods like expandAll(), focusAndReveal(), etc.
   *
   * @example
   * ```tsx
   * let treeRef: TreeViewRef | undefined;
   *
   * <TreeView
   *   ref={(ref) => treeRef = ref}
   *   // ... other props
   * />
   *
   * // Later, use the ref to control the tree
   * treeRef?.expandAll();
   * treeRef?.focusAndReveal("node-id");
   * ```
   */
  ref?: (ref: TreeViewRef) => void;
}

/**
 * Reference interface for programmatic control of the TreeView component.
 * Provides methods to manipulate tree state, navigation, and operations.
 */
export interface TreeViewRef {
  expandAll: () => void;
  collapseAll: () => void;
  collapseAllExceptFocused: () => void;
  collapseAllExceptSelected: () => void;
  collapseSome: () => void;
  foldCycle: () => void;
  focusAndReveal: (nodeId: string) => Promise<void>;
  cut: (nodeId: string) => void;
  paste: (targetId: string) => void;
  clearCut: () => void;
  refreshTree: () => void;
  rename: (nodeId?: string) => void;
  createNew: (parentId?: string) => void;
  delete: (nodeId?: string) => void;
}

export interface TreeItemProps {
  node: TreeNode;
}

export type FoldCycleState = 0 | 1 | 2;
