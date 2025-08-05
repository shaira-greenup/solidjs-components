import { SetStoreFunction } from "solid-js/store";
import { LayoutState } from "./types/layout";
import { Accessor, createContext, Setter, useContext } from "solid-js";

export interface LayoutContextType {
  layoutState: LayoutState;
  setLayoutState: SetStoreFunction<LayoutState>;
  isDev: Accessor<boolean>;
  setIsDev: Setter<boolean>;
  MAX_WIDTH: number;
  MIN_WIDTH: number;
  BottomDashOnlyMobile: boolean;
}

export const LayoutContext = createContext<LayoutContextType>();

/**
 * Retrieve the context from provider if possible
 *
 * If the context is availble retrieve it or throw an error.
 *
 * Usage
 *
 * ```tsx
 * const Layout = () =>  (
 *    <LayoutContext.Provider
 *      value={{
 *        layoutState: layoutState,
 *        setLayoutState: setLayoutState,
 *        isDev: isDev,
 *        setIsDev: setIsDev,
 *        MIN_WIDTH: MIN_WIDTH,
 *        MAX_WIDTH: MAX_WIDTH,
 *      }}
 *    >
 *      {props.children}
 *    </LayoutContext.Provider>
 *  )
 *
 *  export default function page() {
 *      return (
 *      <Layout>
 *          <Layout.Navbar>
 *          ...
 *          </Layout.Navbar>
 *      </Layout>
 *      );
 *  }
 *
 *  const Navbar = () => {
 *  const { layoutState, setLayoutState, isDev, setIsDev } = getLayoutContext();
 *
 *  return (
 *      /// ...
 *  );
 *
 *  };
 *
 *
 *  ```
 *
 */
export const getLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "LayoutContext can only be used within the <Layout> component",
    );
  }
  return context;
};
