import { createContext, useContext } from "solid-js";
import { TreeContextValue } from "./types";

export const TreeContext = createContext<TreeContextValue>();

export const useTreeContext = (): TreeContextValue => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTreeContext must be used within a TreeView");
  }
  return context;
};

export const isValidTreeNode = (node: unknown): node is { id: string; label: string } => {
  return (
    typeof node === "object" &&
    node !== null &&
    typeof (node as any).id === "string" &&
    typeof (node as any).label === "string"
  );
};