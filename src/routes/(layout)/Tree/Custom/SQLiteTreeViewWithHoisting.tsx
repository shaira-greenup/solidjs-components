import { createSignal, Component, createEffect, createResource, For, Suspense } from "solid-js";
import { TreeViewRef } from "~/components/tree/types";
import { TreeNode, TreeView } from "~/components/tree/TreeView";
import {
  createNewItem,
  deleteItem,
  loadTreeChildren,
  moveItem,
  renameItem,
  getNotePath,
} from "~/lib/server-actions";

export interface SQLiteTreeViewWithHoistingProps {
  onSelect?: (node: TreeNode) => void;
  onFocus?: (node: TreeNode) => void;
  onExpand?: (nodeId: string) => void;
  ref?: (ref: TreeViewRef & { hoistToNode: (nodeId: string) => void; navigateUp: () => void; resetToRoot: () => void }) => void;
  hoistedRoot?: () => string;
  setHoistedRoot?: (rootId: string) => void;
  setExpandedItems?: (items: string[] | ((prev: string[]) => string[])) => void;
}

export const SQLiteTreeViewWithHoisting: Component<SQLiteTreeViewWithHoistingProps> = (props) => {
  const [internalHoistedRoot, setInternalHoistedRoot] = createSignal<string>("__virtual_root__");
  let treeViewRef: TreeViewRef | undefined;

  // Use external hoisted root if provided, otherwise use internal
  const hoistedRoot = props.hoistedRoot || internalHoistedRoot;
  const setHoistedRoot = props.setHoistedRoot || setInternalHoistedRoot;

  // Create a resource for the breadcrumb path
  const [breadcrumbPath] = createResource(hoistedRoot, async (rootId) => {
    if (rootId === "__virtual_root__") {
      return [{
        id: "__virtual_root__",
        label: "Root",
        hasChildren: true,
        level: 0,
        type: "folder" as const
      }];
    }
    return await getNotePath(rootId);
  });

  /**
   * Load children directly from the database
   */
  const loadChildren = async (nodeId: string): Promise<TreeNode[]> => {
    try {
      // If we're asking for virtual root but have a hoisted root, return the hoisted node's children
      if (nodeId === "__virtual_root__" && hoistedRoot() !== "__virtual_root__") {
        return await loadTreeChildren(hoistedRoot());
      }
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

  /**
   * Hoist the tree to a specific node (set it as the new root)
   */
  const hoistToNode = (nodeId: string) => {
    setHoistedRoot(nodeId);
    props.setExpandedItems?.([]); // Clear expanded items when hoisting
    triggerRefresh();
  };

  /**
   * Navigate up one level in the hoisted hierarchy
   */
  const navigateUp = async () => {
    if (hoistedRoot() === "__virtual_root__") return;

    try {
      const path = await getNotePath(hoistedRoot());
      if (path.length >= 2) {
        // Go to parent (second-to-last in path)
        const parent = path[path.length - 2];
        hoistToNode(parent.id);
      } else {
        // Go to root
        hoistToNode("__virtual_root__");
      }
    } catch (error) {
      console.error("Error navigating up:", error);
    }
  };

  /**
   * Reset to the true root
   */
  const resetToRoot = () => {
    hoistToNode("__virtual_root__");
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
      "7. Hoist Here (Set as Root)",
      "8. Cancel",
    ];

    const action = prompt(
      `Choose action for "${node.label}":\n${actions.join("\n")}`,
      "8",
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
      case "7":
        hoistToNode(node.id);
        console.log("Hoisted to node:", node.id);
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
    hoistToNode,
    navigateUp,
    resetToRoot,
  };

  // Expose the ref to parent component immediately
  props.ref?.(exposedRef);

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div class="mb-4">
        <div class="breadcrumbs text-sm">
          <ul>
            <Suspense fallback={<li><span class="loading loading-spinner loading-sm"></span></li>}>
              <For each={breadcrumbPath()}>
                {(pathNode, index) => (
                  <li>
                    <button
                      class={`link ${index() === (breadcrumbPath()?.length ?? 0) - 1 ? 'link-primary font-semibold' : 'link-hover'}`}
                      onClick={() => {
                        if (pathNode.id !== hoistedRoot()) {
                          hoistToNode(pathNode.id);
                        }
                      }}
                    >
                      {pathNode.label}
                    </button>
                  </li>
                )}
              </For>
            </Suspense>
          </ul>
        </div>
        {hoistedRoot() !== "__virtual_root__" && (
          <div class="text-xs text-base-content/50 mt-1">
            Tree view is focused on: <span class="font-mono">{hoistedRoot()}</span>
          </div>
        )}
      </div>

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
    </div>
  );
};
