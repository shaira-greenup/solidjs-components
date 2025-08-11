import { createStore, SetStoreFunction } from "solid-js/store";
import { LayoutState } from "./types/layout";
import {
  Accessor,
  createContext,
  createSignal,
  JSXElement,
  Setter,
  useContext,
} from "solid-js";

/**
 * We use a Context Provider here in the event the user wants to
 * Refactor the layout.
 *
 */

interface LayoutContext {
  layoutState: LayoutState;
  setLayoutState: SetStoreFunction<LayoutState>;
  isDev: Accessor<boolean>;
  setIsDev: Setter<boolean>;
}

export const LayoutContext = createContext<LayoutContext>();
export function getLayoutContext(): LayoutContext {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("Layout Context must be used inside Provider");
  }

  return context;
}
export function LayoutContextProvider(props: { children: JSXElement }) {
  const [layoutState, setLayoutState] = createStore<LayoutState>({
    drawer: {
      width: 256, // Default 256px (w-64)
      visible: false,
      isResizing: false,
      startX: 0,
      startWidth: 0,
    },
    topBar: {
      visible: true,
    },
    bottomDash: {
      visible: true,
    },
  });
  const [isDev, setIsDev] = createSignal(false);
  const context = {
    layoutState: layoutState,
    setLayoutState: setLayoutState,
    isDev: isDev,
    setIsDev: setIsDev,
  };

  return (
    <LayoutContext.Provider value={context}>
      {props.children}
    </LayoutContext.Provider>
  );
}
