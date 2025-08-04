import {
  createContext,
  useContext,
  createEffect,
  createSignal,
  onMount,
  JSX,
  Component,
  ParentComponent,
} from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import "./app.css";
import {
  MainContentSty,
  navbarSty,
  overlaySty,
  resizeHandleSty,
  sidebarSty,
} from "./styles";
import { resizeHandle as _resizeHandle } from "./directives/resize";
import { createGlobalKeybindings } from "./hooks/createGlobalKeybindings";
import { LayoutState } from "./types/layout";
import { BOTTOM_DASH_ONLY_ON_MOBILE } from "./config/constants";

interface LayoutContextValue {
  layoutState: LayoutState;
  setLayoutState: SetStoreFunction<LayoutState>;
  isDev: () => boolean;
  setIsDev: (value: boolean) => void;
  minWidth: number;
  maxWidth: number;
}

const LayoutContext = createContext<LayoutContextValue>();

export function useLayoutContext() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a Layout component");
  }
  return context;
}

export interface LayoutProps {
  children: JSX.Element;
  class?: string;
}

function Layout(props: LayoutProps) {
  const MIN_WIDTH = 200;
  const MAX_WIDTH = 1024;

  const [isDev, setIsDev] = createSignal(false);

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

  // Set up global keybindings (work anywhere on the page, not just when component is focused)
  createGlobalKeybindings(layoutState, setLayoutState, {
    minWidth: MIN_WIDTH,
    maxWidth: MAX_WIDTH,
  });

  /* Update the CSS Variable to adjust the layout  */
  onMount(() => {
    createEffect(() => {
      document.documentElement.style.setProperty(
        "--spacing-sidebar_width",
        `${layoutState.drawer.width}px`,
      );
    });
  });

  const contextValue: LayoutContextValue = {
    layoutState,
    setLayoutState,
    isDev,
    setIsDev,
    minWidth: MIN_WIDTH,
    maxWidth: MAX_WIDTH,
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      <div class={props.class}>{props.children}</div>
    </LayoutContext.Provider>
  );
}

interface CompoundComponentProps {
  children?: JSX.Element;
  class?: string;
}

const Navbar: ParentComponent<CompoundComponentProps> = (props) => {
  const { layoutState, isDev } = useLayoutContext();

  return (
    <div
      class={`${navbarSty({
        visible: layoutState.topBar.visible,
        dev: isDev(),
      })} ${props.class || ""}`}
    >
      {props.children}
    </div>
  );
};

const Sidebar: ParentComponent<CompoundComponentProps> = (props) => {
  const { layoutState, setLayoutState, isDev, minWidth, maxWidth } =
    useLayoutContext();

  return (
    <>
      {/* Overlay */}
      <div
        class={overlaySty({
          visible: layoutState.drawer.visible,
          blur: true,
          bottomDashVisible: layoutState.bottomDash.visible,
        })}
        onclick={() => setLayoutState("drawer", "visible", false)}
      />

      {/* Sidebar */}
      <div
        class={sidebarSty({
          resizing: layoutState.drawer.isResizing,
          isVisible: layoutState.drawer.visible,
          bottomDashVisible: layoutState.bottomDash.visible,
          bottomDashMobileOnly: BOTTOM_DASH_ONLY_ON_MOBILE,
          topNavVisible: layoutState.topBar.visible,
          dev: isDev(),
        })}
      >
        <div class="flex flex-col h-full">
          <div class="flex-1 p-4 overflow-y-auto">{props.children}</div>
        </div>
        {/* Resize Handle */}
        <div
          use:_resizeHandle={{
            layoutState,
            setLayoutState,
            minWidth,
            maxWidth,
          }}
          class={resizeHandleSty({ dev: isDev() })}
        />
      </div>
    </>
  );
};

const Main: ParentComponent<CompoundComponentProps> = (props) => {
  const { layoutState, isDev } = useLayoutContext();

  return (
    <div
      class={MainContentSty({
        drawerVisible: layoutState.drawer.visible,
        isResizing: layoutState.drawer.isResizing,
        isTopVisible: layoutState.topBar.visible,
        isBottomVisible: layoutState.bottomDash.visible,
        bottomDashMobileOnly: BOTTOM_DASH_ONLY_ON_MOBILE,
        dev: isDev(),
      })}
    >
      {props.children}
    </div>
  );
};

const BottomDash: ParentComponent<
  CompoundComponentProps & { mobileOnly?: boolean }
> = (props) => {
  const { layoutState, setLayoutState, isDev } = useLayoutContext();

  return (
    <div
      class={`${props.class || ""} fixed bottom-0 left-0 right-0 ${props.mobileOnly ? "lg:hidden" : ""} ${layoutState.bottomDash.visible ? "" : "translate-y-full"}`}
    >
      {props.children}
    </div>
  );
};

// Attach compound components
Layout.Navbar = Navbar;
Layout.Sidebar = Sidebar;
Layout.Main = Main;
Layout.BottomDash = BottomDash;

export default Layout;

/*
 * # NOTES
 * ## Desired Layout
 * - Mobile
 *   - Sidebar / Drawer Depending on Width
 *   - Bottom Dash for Quick Access
 *     - Can be hidden for convenience and circumstance (narrow AND short display)
 *     - This can also use translate-y to drop away, i.e. no worry about DOM bloat here, small size
 * - Desktop
 *   - Top Header Bar
 *     - Probably this should persist, it should have all user controls
 *   - Sidebar
 *     - Collapsible
 *         - Pushes content aside
 * ## Limitations
 * ## Depencency Map
 * 1. Mobile Drawer bottom- depends on visibility of bottom drawer AND screen size
 *     - Hence we've used a variant to hide this behind the BOTTOM_DASH_ONLY_ON_MOBILE variable
 */
