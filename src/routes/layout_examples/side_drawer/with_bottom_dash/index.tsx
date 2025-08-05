import { createEffect, createSignal, JSXElement, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import "./app.css";
import { createGlobalKeybindings } from "./hooks/createGlobalKeybindings";
import {
  bottomDashSty,
  MainContentSty,
  navbarSty,
  overlaySty,
  resizeHandleSty,
  sidebarSty,
} from "./styles";
import { LayoutState } from "./types/layout";
import { getLayoutContext, LayoutContext } from "./contextTypes";
import BottomDashContent from "./views/BottomDash";
// NOTE this is a required import due to use:resizeHandle
import { resizeHandle } from "./directives/resize";

const Layout = (props: { children: JSXElement }) => {
  const MIN_WIDTH = 100;
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

  return (
    <LayoutContext.Provider
      value={{
        layoutState: layoutState,
        setLayoutState: setLayoutState,
        isDev: isDev,
        setIsDev: setIsDev,
        MIN_WIDTH: MIN_WIDTH,
        MAX_WIDTH: MAX_WIDTH,
        BottomDashOnlyMobile: false,
      }}
    >
      {props.children}
    </LayoutContext.Provider>
  );
};

const Navbar = (props: { children: JSXElement }) => {
  const { layoutState, isDev } = getLayoutContext();

  return (
    <div
      class={navbarSty({
        visible: layoutState.topBar.visible,
        dev: isDev(),
      })}
    >
      {props.children}
    </div>
  );
};

const Sidebar = (props: { children: JSXElement }) => {
  const {
    layoutState,
    setLayoutState,
    isDev,
    MIN_WIDTH,
    MAX_WIDTH,
    BottomDashOnlyMobile,
  } = getLayoutContext();

  return (
    <>
      <Overlay />
      <div
        class={sidebarSty({
          resizing: layoutState.drawer.isResizing,
          isVisible: layoutState.drawer.visible,
          bottomDashVisible: layoutState.bottomDash.visible,
          bottomDashMobileOnly: BottomDashOnlyMobile,
          topNavVisible: layoutState.topBar.visible,
          dev: isDev(),
        })}
      >
        {props.children}
        {/* Resize Handle */}
        <div
          use:resizeHandle={{
            layoutState,
            setLayoutState,
            minWidth: MIN_WIDTH,
            maxWidth: MAX_WIDTH,
          }}
          class={resizeHandleSty({ dev: isDev() })}
        />
      </div>
    </>
  );
};

const Overlay = () => {
  const { layoutState, setLayoutState } = getLayoutContext();

  return (
    <div
      class={overlaySty({
        visible: layoutState.drawer.visible,
        blur: true,
        bottomDashVisible: layoutState.bottomDash.visible,
      })}
      onclick={() => setLayoutState("drawer", "visible", false)}
    />
  );
};

const BottomDash = () => {
  const { layoutState, setLayoutState, isDev, BottomDashOnlyMobile } =
    getLayoutContext();
  return (
    <div
      class={bottomDashSty({
        hidden: !layoutState.bottomDash.visible,
        mobileOnly: BottomDashOnlyMobile,
        dev: isDev(),
      })}
    >
      <BottomDashContent
        layoutState={layoutState}
        setLayoutState={setLayoutState}
        isDev={isDev()}
      />
    </div>
  );
};

const MainArea = (props: { children: JSXElement }) => {
  const { layoutState, isDev, BottomDashOnlyMobile } = getLayoutContext();
  return (
    <div
      class={MainContentSty({
        drawerVisible: layoutState.drawer.visible,
        isResizing: layoutState.drawer.isResizing,
        isTopVisible: layoutState.topBar.visible,
        isBottomVisible: layoutState.bottomDash.visible,
        bottomDashMobileOnly: BottomDashOnlyMobile,
        dev: isDev(),
      })}
    >
      {props.children}
    </div>
  );
};

Layout.Navbar = Navbar;
Layout.Overlay = Overlay;
Layout.Sidebar = Sidebar;
Layout.MainArea = MainArea;
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
