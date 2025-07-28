import { createSignal, createMemo, createResource, createEffect } from "solid-js";
import { TreeNode, TreeViewProps, FoldCycleState } from "../types";
import { VIRTUAL_ROOT_ID } from "../constants";

export interface TreeState {
  selectedNode: () => TreeNode | null;
  setSelectedNode: (node: TreeNode | null) => void;
  focusedNode: () => TreeNode | null;
  setFocusedNode: (node: TreeNode | null) => void;
  expandedNodes: () => Set<string>;
  setExpandedNodes: (nodes: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  loadedChildren: () => Map<string, TreeNode[]>;
  setLoadedChildren: (children: Map<string, TreeNode[]> | ((prev: Map<string, TreeNode[]>) => Map<string, TreeNode[]>)) => void;
  foldCycleState: () => FoldCycleState;
  setFoldCycleState: (state: FoldCycleState) => void;
  cutNodeId: () => string | undefined;
  setCutNodeId: (id: string | undefined) => void;
  editingNodeId: () => string | undefined;
  setEditingNodeId: (id: string | undefined) => void;
  pendingFocusNodeId: () => string | undefined;
  setPendingFocusNodeId: (id: string | undefined) => void;
  pendingExpansions: () => Map<string, boolean>;
  setPendingExpansions: (expansions: Map<string, boolean>) => void;
  rootChildren: () => TreeNode[] | undefined;
  focusedNodeId: () => string | undefined;
  selectedNodeId: () => string | undefined;
}

export const useTreeState = (props: TreeViewProps): TreeState => {
  const [selectedNode, setSelectedNode] = createSignal<TreeNode | null>(null);
  const [focusedNode, setFocusedNode] = createSignal<TreeNode | null>(null);
  const [expandedNodes, setExpandedNodes] = createSignal<Set<string>>(
    new Set([VIRTUAL_ROOT_ID])
  );
  const [loadedChildren, setLoadedChildren] = createSignal<Map<string, TreeNode[]>>(
    new Map()
  );
  const [foldCycleState, setFoldCycleState] = createSignal<FoldCycleState>(0);
  const [cutNodeId, setCutNodeId] = createSignal<string | undefined>(undefined);
  const [editingNodeId, setEditingNodeId] = createSignal<string | undefined>(undefined);
  const [pendingFocusNodeId, setPendingFocusNodeId] = createSignal<string | undefined>(undefined);
  const [pendingExpansions, setPendingExpansions] = createSignal<Map<string, boolean>>(
    new Map()
  );

  const [rootChildren] = createResource(async () => {
    const children = await props.loadChildren(VIRTUAL_ROOT_ID);
    return children;
  });

  createEffect(() => {
    const children = rootChildren();
    if (children) {
      setLoadedChildren((prev) => {
        const newMap = new Map(prev);
        newMap.set(VIRTUAL_ROOT_ID, children);
        return newMap;
      });
    }
  });

  const focusedNodeId = createMemo(() => focusedNode()?.id);
  const selectedNodeId = createMemo(() => selectedNode()?.id);

  // Auto-focus first root node when available
  createEffect(() => {
    const rootNodes = loadedChildren().get(VIRTUAL_ROOT_ID);
    if (rootNodes && rootNodes.length > 0 && !focusedNode()) {
      setFocusedNode(rootNodes[0]);
    }
  });

  // Handle pending expansions
  createEffect(() => {
    const pending = pendingExpansions();
    if (pending.size > 0) {
      setExpandedNodes((prev) => {
        const newSet = new Set(prev);
        pending.forEach((shouldExpand, nodeId) => {
          if (shouldExpand) {
            newSet.add(nodeId);
          } else {
            newSet.delete(nodeId);
          }
        });
        return newSet;
      });

      setPendingExpansions(new Map());
    }
  });

  return {
    selectedNode,
    setSelectedNode,
    focusedNode,
    setFocusedNode,
    expandedNodes,
    setExpandedNodes,
    loadedChildren,
    setLoadedChildren,
    foldCycleState,
    setFoldCycleState,
    cutNodeId,
    setCutNodeId,
    editingNodeId,
    setEditingNodeId,
    pendingFocusNodeId,
    setPendingFocusNodeId,
    pendingExpansions,
    setPendingExpansions,
    rootChildren,
    focusedNodeId,
    selectedNodeId,
  };
};