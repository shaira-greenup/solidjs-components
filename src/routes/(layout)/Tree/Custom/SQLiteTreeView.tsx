import { createSignal, Component } from "solid-js";
import { TreeViewRef } from "~/components/tree/types";
import { TreeNode, TreeView } from "~/components/tree/TreeView";

import {
  createNewItem,
  deleteItem,
  loadTreeChildren,
  moveItem,
  renameItem,
} from "~/lib/server-actions";

export interface SQLiteTreeViewProps {
  onSelect?: (node: TreeNode) => void;
  onFocus?: (node: TreeNode) => void;
  onExpand?: (nodeId: string) => void;
  ref?: (ref: TreeViewRef) => void;
}

export const SQLiteTreeView: Component<SQLiteTreeViewProps> = (props) => {
  let treeViewRef: TreeViewRef | undefined;

  /**
   * Load children directly from the database
   */
  const loadChildren = async (nodeId: string): Promise<TreeNode[]> => {
    try {
      return await loadTreeChildren(nodeId);
    } catch (error) {
      console.error("Error loading children:", error);
      return [];
    }
  };

  /**
   * Triggers a refresh of the tree data
   */
  const triggerRefresh = () => {
    treeViewRef?.refreshTree();
  };

  const handleMoveItemToNewParent = async (
    sourceId: string,
    targetId: string,
  ): Promise<boolean> => {
    try {
      const success = await moveItem(sourceId, targetId);
      if (success) {
        triggerRefresh();
      }
      return success;
    } catch (error) {
      console.error("Error in cut/paste operation:", error);
      return false;
    }
  };

  const handleRename = async (
    nodeId: string,
    newLabel: string,
  ): Promise<boolean> => {
    try {
      const success = await renameItem(nodeId, newLabel);
      if (success) {
        console.log(`Renamed node ${nodeId} to "${newLabel}"`);
        triggerRefresh();
      }
      return success;
    } catch (error) {
      console.error("Error renaming item:", error);
      return false;
    }
  };

  const handleCreateNew = async (parentId: string): Promise<string | null> => {
    try {
      const newItemId = await createNewItem(parentId, "note");
      if (newItemId) {
        console.log(
          `Created new item with ID ${newItemId} under parent ${parentId}`,
        );
        triggerRefresh();
      }
      return newItemId;
    } catch (error) {
      console.error("Error creating new item:", error);
      return null;
    }
  };

  const handleDelete = async (nodeId: string): Promise<boolean> => {
    try {
      const success = await deleteItem(nodeId);
      if (success) {
        console.log(`Deleted node ${nodeId} and its descendants`);
        triggerRefresh();
      }
      return success;
    } catch (error) {
      console.error("Error deleting item:", error);
      return false;
    }
  };

  const handleContextMenu = async (node: TreeNode, event: MouseEvent) => {
    console.log("Context menu for node:", node);

    // Simple context menu - you could enhance this with a proper dropdown
    const actions = [
      "1. Cut",
      "2. Paste",
      "3. Move to Root",
      "4. Rename",
      "5. Create New Note Here",
      "6. Delete",
      "7. Cancel",
    ];

    const action = prompt(
      `Choose action for "${node.label}":\n${actions.join("\n")}`,
      "7",
    );

    switch (action) {
      case "1":
        treeViewRef?.cut(node.id);
        console.log("Cut node:", node.id);
        break;
      case "2":
        treeViewRef?.paste(node.id);
        console.log("Paste to node:", node.id);
        break;
      case "3":
        await handleMoveItemToNewParent(node.id, "__virtual_root__");
        console.log("Moved to root:", node.id);
        break;
      case "4":
        treeViewRef?.rename(node.id);
        console.log("Rename node:", node.id);
        break;
      case "5":
        await handleCreateNew(node.id);
        console.log("Create new item under:", node.id);
        break;
      case "6":
        if (
          confirm(
            `Are you sure you want to delete "${node.label}" and all its children?`,
          )
        ) {
          treeViewRef?.delete(node.id);
          console.log("Delete node:", node.id);
        }
        break;
      default:
        console.log("Context menu cancelled");
    }
  };

  // Create the ref object immediately
  const exposedRef = {
    refreshTree: () => treeViewRef?.refreshTree(),
    expandAll: () => treeViewRef?.expandAll(),
    collapseAll: () => treeViewRef?.collapseAll(),
    collapseAllExceptFocused: () => treeViewRef?.collapseAllExceptFocused(),
    collapseAllExceptSelected: () => treeViewRef?.collapseAllExceptSelected(),
    collapseSome: () => treeViewRef?.collapseSome(),
    foldCycle: () => treeViewRef?.foldCycle(),
    clearCut: () => treeViewRef?.clearCut(),
    rename: (nodeId?: string) => treeViewRef?.rename(nodeId),
    createNew: () => treeViewRef?.createNew(),
    delete: (nodeId?: string) => treeViewRef?.delete(nodeId),
    cut: (nodeId: string) => treeViewRef?.cut(nodeId),
    paste: (nodeId: string) => treeViewRef?.paste(nodeId),
  } as TreeViewRef;

  // Expose the ref to parent component immediately
  props.ref?.(exposedRef);

  return (
    <TreeView
      onSelect={props.onSelect}
      onFocus={props.onFocus}
      onExpand={props.onExpand}
      loadChildren={loadChildren}
      onCreate={handleCreateNew}
      onMoveItemToNewParent={handleMoveItemToNewParent}
      onRename={handleRename}
      onDelete={handleDelete}
      onContextMenu={handleContextMenu}
      ref={(ref) => (treeViewRef = ref)}
    />
  );
};
