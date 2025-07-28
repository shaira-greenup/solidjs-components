import { createMemo } from "solid-js";
import { TreeNode, TreeViewProps } from "../types";
import { TreeState } from "./useTreeState";
import { VIRTUAL_ROOT_ID, REFRESH_TREE_AFTER_RENAME } from "../constants";
import { getParentId, getPathToNode, findNodeInChildren } from "../utils";

export interface TreeOperations {
  handleSelect: (node: TreeNode) => void;
  handleFocus: (node: TreeNode) => void;
  handleExpand: (nodeId: string) => void;
  handleChildrenLoaded: (nodeId: string, children: TreeNode[]) => void;
  handleCut: (nodeId: string) => void;
  handlePaste: (targetId: string) => Promise<void>;
  handleMoveToRoot: (nodeId?: string) => Promise<void>;
  clearCut: () => void;
  handleCreateNew: (parentId?: string) => Promise<void>;
  handleDelete: (nodeId?: string) => Promise<void>;
  handleRename: (nodeId?: string) => void;
  handleRenameCommit: (nodeId: string, newLabel: string) => Promise<void>;
  handleRenameCancel: () => void;
  refreshTree: () => void;
  refreshParents: (parentIds: string[], options?: { forceExpand?: boolean }) => void;
  refreshParentChildren: (parentId: string, options?: { expand?: boolean; focusChild?: string }) => Promise<void>;
  expandAll: () => Promise<void>;
  collapseAll: () => void;
  collapseAllExceptFocused: () => void;
  collapseAllExceptSelected: () => void;
  collapseSome: () => void;
  foldCycle: () => void;
  focusAndReveal: (nodeId: string) => Promise<void>;
  updateNodeLabelInPlace: (nodeId: string, newLabel: string) => void;
  getParentIdMemo: () => (nodeId: string) => string | null;
  getPathToNodeMemo: () => (nodeId: string) => string[] | null;
}

export const useTreeOperations = (
  state: TreeState,
  props: TreeViewProps,
  refs: { treeRef?: HTMLUListElement | (() => HTMLUListElement | undefined) }
): TreeOperations => {
  const getParentIdMemo = createMemo(() => {
    const loaded = state.loadedChildren();
    return (nodeId: string): string | null => getParentId(nodeId, loaded);
  });

  const getPathToNodeMemo = createMemo(() => {
    const loaded = state.loadedChildren();
    return (nodeId: string): string[] | null =>
      getPathToNode(nodeId, loaded, VIRTUAL_ROOT_ID);
  });

  const handleSelect = (node: TreeNode) => {
    state.setSelectedNode(node);
    props.onSelect?.(node);
  };

  const handleFocus = (node: TreeNode) => {
    state.setFocusedNode(node);
    props.onFocus?.(node);
  };

  const handleExpand = (nodeId: string) => {
    state.setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
    props.onExpand?.(nodeId);
  };

  const handleChildrenLoaded = (nodeId: string, children: TreeNode[]) => {
    state.setLoadedChildren((prev) => {
      const newMap = new Map(prev);
      newMap.set(nodeId, children);
      return newMap;
    });
  };

  const handleCut = (nodeId: string) => {
    state.setCutNodeId(nodeId);
  };

  /*
      Refresh only the items required by collapsing and expanding
      causing the data to be loaded back from the database in a simple way

      For debugging, use the `operations.refreshTree();` to refresh the entire tree.
  */
  const refreshParentChildren = async (
    parentId: string,
    options: { expand?: boolean; focusChild?: string } = {}
  ) => {
    try {
      if (options.expand) {
        state.setExpandedNodes((prev) => new Set([...prev, parentId]));
      }

      const children = await props.loadChildren(parentId);
      state.setLoadedChildren((prev) => {
        const newMap = new Map(prev);
        newMap.set(parentId, children);
        return newMap;
      });

      if (options.focusChild) {
        state.setPendingFocusNodeId(options.focusChild);
      }
    } catch (error) {
      console.warn(`Failed to refresh parent ${parentId}:`, error);
    }
  };

  const refreshParents = (
    parentIds: string[],
    options: { forceExpand?: boolean } = {}
  ) => {
    const getParentIdFn = getParentIdMemo();
    const expanded = state.expandedNodes();
    const loaded = state.loadedChildren();

    // Resolve leaf nodes to their parents, deduplicate
    const parentsToRefresh = [
      ...new Set(
        parentIds
          .filter((id) => id)
          .map((id) => {
            // If it's a leaf node (not expanded, no children), use grandparent
            if (
              id !== VIRTUAL_ROOT_ID &&
              !expanded.has(id) &&
              !loaded.has(id)
            ) {
              return getParentIdFn(id) || VIRTUAL_ROOT_ID;
            }
            return id;
          })
      ),
    ];

    // Store expansion states, clear children, collapse
    const wasExpanded = new Map(
      parentsToRefresh.map((id) => [id, expanded.has(id)])
    );

    state.setLoadedChildren((prev) => {
      const newMap = new Map(prev);
      parentsToRefresh.forEach(
        (id) => id !== VIRTUAL_ROOT_ID && newMap.delete(id)
      );
      return newMap;
    });

    state.setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      parentsToRefresh.forEach(
        (id) => id !== VIRTUAL_ROOT_ID && newSet.delete(id)
      );
      return newSet;
    });

    // Queue re-expansion
    const toExpand = parentsToRefresh
      .filter(
        (id) =>
          id !== VIRTUAL_ROOT_ID &&
          (options.forceExpand || wasExpanded.get(id))
      )
      .map((id) => [id, true] as const);

    if (toExpand.length) state.setPendingExpansions(new Map(toExpand));

    // Handle virtual root
    if (parentsToRefresh.includes(VIRTUAL_ROOT_ID)) {
      state.setLoadedChildren((prev) => {
        prev.delete(VIRTUAL_ROOT_ID);
        return new Map(prev);
      });
      props.loadChildren(VIRTUAL_ROOT_ID).then((children) => {
        state.setLoadedChildren((prev) =>
          new Map(prev).set(VIRTUAL_ROOT_ID, children)
        );
      });
    }
  };

  const handlePaste = async (targetId: string) => {
    const cutId = state.cutNodeId();
    if (!cutId || !props.onMoveItemToNewParent) return;

    try {
      const operationSucceeded = await props.onMoveItemToNewParent(cutId, targetId);
      if (operationSucceeded) {
        const getParentIdFn = getParentIdMemo();
        const sourceParentId = getParentIdFn(cutId);

        // Refresh target parent (expand and focus moved item)
        await refreshParentChildren(targetId, {
          expand: true,
          focusChild: cutId,
        });

        // Refresh source parent if different
        if (sourceParentId && sourceParentId !== targetId) {
          await refreshParentChildren(sourceParentId);
        }

        state.setCutNodeId(undefined);
      }
    } catch (error) {
      console.warn("Cut/paste operation failed:", error);
    }
  };

  const handleMoveToRoot = async (nodeId?: string) => {
    const targetNodeId = nodeId || state.focusedNode()?.id;
    if (!targetNodeId || !props.onMoveItemToNewParent) return;

    try {
      const operationSucceeded = await props.onMoveItemToNewParent(
        targetNodeId,
        VIRTUAL_ROOT_ID
      );
      if (operationSucceeded) {
        const getParentIdFn = getParentIdMemo();
        const sourceParentId = getParentIdFn(targetNodeId);

        // Refresh root (focus moved item)
        await refreshParentChildren(VIRTUAL_ROOT_ID, {
          focusChild: targetNodeId,
        });

        // Refresh source parent if different
        if (sourceParentId && sourceParentId !== VIRTUAL_ROOT_ID) {
          await refreshParentChildren(sourceParentId);
        }
      }
    } catch (error) {
      console.warn("Move to root operation failed:", error);
    }
  };

  const clearCut = () => {
    state.setCutNodeId(undefined);
  };

  const handleCreateNew = async (parentId?: string) => {
    const targetParentId = parentId || state.focusedNode()?.id || VIRTUAL_ROOT_ID;
    if (!props.onCreate) return;

    try {
      const newItemId = await props.onCreate(targetParentId);
      if (newItemId) {
        await refreshParentChildren(targetParentId, {
          expand: true,
          focusChild: newItemId,
        });
      }
    } catch (error) {
      console.warn("Create operation failed:", error);
    }
  };

  const handleDelete = async (nodeId?: string) => {
    const targetNodeId = nodeId || state.focusedNode()?.id;
    if (!targetNodeId || !props.onDelete) return;

    try {
      const success = await props.onDelete(targetNodeId);
      if (success) {
        const getParentIdFn = getParentIdMemo();
        const parentId = getParentIdFn(targetNodeId) || VIRTUAL_ROOT_ID;

        // Clear states if they were on the deleted node
        if (state.focusedNode()?.id === targetNodeId) state.setFocusedNode(null);
        if (state.selectedNode()?.id === targetNodeId) state.setSelectedNode(null);
        if (state.cutNodeId() === targetNodeId) state.setCutNodeId(undefined);

        refreshParents([parentId]);
      }
    } catch (error) {
      console.warn("Delete operation failed:", error);
    }
  };

  const handleRename = (nodeId?: string) => {
    const targetNodeId = nodeId || state.focusedNode()?.id;
    if (targetNodeId) state.setEditingNodeId(targetNodeId);
  };

  const handleRenameCommit = async (nodeId: string, newLabel: string) => {
    if (!props.onRename) return;

    try {
      const success = await props.onRename(nodeId, newLabel);
      if (success) {
        state.setEditingNodeId(undefined);
        if (REFRESH_TREE_AFTER_RENAME) {

          updateNodeLabelInPlace(nodeId, newLabel);
        } else {

          const getParentIdFn = getParentIdMemo();
          const parentId = getParentIdFn(nodeId) || VIRTUAL_ROOT_ID;

          await refreshParentChildren(parentId, {
            focusChild: nodeId,
          });
        }
      }
    } catch (error) {
      console.warn("Rename operation failed:", error);
    }
  };

  const handleRenameCancel = () => state.setEditingNodeId(undefined);

  const updateNodeLabelInPlace = (nodeId: string, newLabel: string) => {
    const nodeElement = refs.treeRef?.querySelector(
      `a[data-node-id="${nodeId}"] span`
    );
    if (nodeElement) nodeElement.textContent = newLabel;
  };

  const refreshTree = () => {
    const currentExpansions = new Set(state.expandedNodes());
    state.setLoadedChildren(new Map());
    state.setExpandedNodes(new Set([VIRTUAL_ROOT_ID]));

    props.loadChildren(VIRTUAL_ROOT_ID).then((children) => {
      state.setLoadedChildren((prev) => new Map(prev).set(VIRTUAL_ROOT_ID, children));
      const nodesToRestore = Array.from(currentExpansions).filter(
        (id) => id !== VIRTUAL_ROOT_ID
      );
      if (nodesToRestore.length > 0) {
        state.setPendingExpansions(new Map(nodesToRestore.map((id) => [id, true])));
      }
    });
  };

  const expandAll = async () => {
    const expandLevel = async (nodes: TreeNode[]) => {
      const nodesToExpand = nodes.filter((node) => node.hasChildren);
      if (nodesToExpand.length === 0) return;

      state.setExpandedNodes((prev) => {
        const newSet = new Set(prev);
        nodesToExpand.forEach((node) => newSet.add(node.id));
        return newSet;
      });

      const childrenLoadPromises = nodesToExpand.map(async (node) => {
        try {
          const children = await props.loadChildren(node.id);
          if (children?.length > 0) {
            state.setLoadedChildren((prev) => new Map(prev).set(node.id, children));
            return children;
          }
        } catch (error) {
          console.warn(`Failed to load children for node ${node.id}:`, error);
        }
        return [];
      });

      const allChildrenArrays = await Promise.all(childrenLoadPromises);
      const nextLevelNodes = allChildrenArrays.flat();
      if (nextLevelNodes.length > 0) {
        await expandLevel(nextLevelNodes);
      }
    };

    const rootNodes = state.loadedChildren().get(VIRTUAL_ROOT_ID);
    if (rootNodes) await expandLevel(rootNodes);
  };

  const collapseAll = () => state.setExpandedNodes(new Set([VIRTUAL_ROOT_ID]));

  const collapseAllExceptNode = (node: TreeNode | null) => {
    if (!node) {
      collapseAll();
      return;
    }

    const getPathFn = getPathToNodeMemo();
    const pathToNode = getPathFn(node.id);
    if (pathToNode) {
      state.setExpandedNodes(new Set([VIRTUAL_ROOT_ID, ...pathToNode.slice(0, -1)]));
    } else {
      collapseAll();
    }
  };

  const collapseAllExceptFocused = () => collapseAllExceptNode(state.focusedNode());
  const collapseAllExceptSelected = () => collapseAllExceptNode(state.selectedNode());

  const collapseSome = () => {
    const focused = state.focusedNode();
    const selected = state.selectedNode();

    if (!focused && !selected) {
      collapseAll();
      return;
    }

    const pathsToKeep = new Set<string>([VIRTUAL_ROOT_ID]);
    const getPathFn = getPathToNodeMemo();

    if (focused) {
      const pathToFocused = getPathFn(focused.id);
      if (pathToFocused) {
        pathToFocused.slice(0, -1).forEach((id) => pathsToKeep.add(id));
      }
    }

    if (selected && selected.id !== focused?.id) {
      const pathToSelected = getPathFn(selected.id);
      if (pathToSelected) {
        pathToSelected.slice(0, -1).forEach((id) => pathsToKeep.add(id));
      }
    }

    state.setExpandedNodes(pathsToKeep);
  };

  const foldCycle = () => {
    const currentState = state.foldCycleState();

    switch (currentState) {
      case 0:
        const rootNodes = state.loadedChildren().get(VIRTUAL_ROOT_ID);
        if (!rootNodes) return;
        const topLevelParentIds = rootNodes
          .filter((node) => node.hasChildren)
          .map((node) => node.id);
        state.setExpandedNodes(new Set([VIRTUAL_ROOT_ID, ...topLevelParentIds]));
        state.setFoldCycleState(1);
        break;
      case 1:
        expandAll();
        state.setFoldCycleState(2);
        break;
      case 2:
        collapseAll();
        state.setFoldCycleState(0);
        break;
    }
  };

  const focusAndReveal = async (nodeId: string) => {
    let targetNode = findNodeInChildren(nodeId, state.loadedChildren());

    if (!targetNode) {
      const expandAndSearch = async (
        currentNodes: TreeNode[],
        targetId: string
      ): Promise<TreeNode | null> => {
        for (const node of currentNodes) {
          if (targetId.startsWith(node.id + "-") || targetId === node.id) {
            if (node.id === targetId) return node;

            if (node.hasChildren) {
              state.setExpandedNodes((prev) => new Set([...prev, node.id]));
              try {
                const dynamicChildren = await props.loadChildren(node.id);
                if (dynamicChildren?.length > 0) {
                  state.setLoadedChildren((prev) =>
                    new Map(prev).set(node.id, dynamicChildren)
                  );
                  const found = await expandAndSearch(dynamicChildren, targetId);
                  if (found) return found;
                }
              } catch (error) {
                console.warn(
                  `Failed to load children for node ${node.id}:`,
                  error
                );
              }
            }
          }
        }
        return null;
      };

      const rootNodes = state.loadedChildren().get(VIRTUAL_ROOT_ID);
      if (rootNodes) {
        targetNode = await expandAndSearch(rootNodes, nodeId);
      }
    }

    if (!targetNode) {
      console.warn(`Node with id "${nodeId}" not found in tree`);
      return;
    }

    const getPathFn = getPathToNodeMemo();
    const pathToTarget = getPathFn(nodeId);
    if (pathToTarget) {
      const parentsToExpand = pathToTarget.slice(0, -1);
      state.setExpandedNodes((prev) => {
        const newSet = new Set(prev);
        newSet.add(VIRTUAL_ROOT_ID);
        parentsToExpand.forEach((id) => newSet.add(id));
        return newSet;
      });
      handleFocus(targetNode);
    }
  };

  return {
    handleSelect,
    handleFocus,
    handleExpand,
    handleChildrenLoaded,
    handleCut,
    handlePaste,
    handleMoveToRoot,
    clearCut,
    handleCreateNew,
    handleDelete,
    handleRename,
    handleRenameCommit,
    handleRenameCancel,
    refreshTree,
    refreshParents,
    refreshParentChildren,
    expandAll,
    collapseAll,
    collapseAllExceptFocused,
    collapseAllExceptSelected,
    collapseSome,
    foldCycle,
    focusAndReveal,
    updateNodeLabelInPlace,
    getParentIdMemo,
    getPathToNodeMemo,
  };
};
