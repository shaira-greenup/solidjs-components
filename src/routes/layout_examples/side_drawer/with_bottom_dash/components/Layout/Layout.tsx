import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  For,
  JSXElement,
  onMount,
  Setter,
  useContext,
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
import { resizeHandle } from "./directives/resize";
import { createGlobalKeybindings } from "./hooks/createGlobalKeybindings";
import Article from "./views/Article";
import SidebarContent from "./views/SidebarContent";
import NavbarContent from "./views/Navbar";
import BottomDash from "./views/BottomDash";
import { LayoutState } from "./types/layout";
import { BOTTOM_DASH_ONLY_ON_MOBILE } from "./config/constants";
import { getLayoutContext } from "./LayoutContext";

interface LayoutProps {
  NavbarContent: JSXElement;
  sidebarContent: JSXElement;
  children: JSXElement;
  bottomDash: JSXElement;
}

function Layout(props: LayoutProps) {
  const MIN_WIDTH = 200;
  const MAX_WIDTH = 1024;
  const context = getLayoutContext();
  const layoutState = context.layoutState;
  const setLayoutState = context.setLayoutState;
  const isDev = context.isDev;
  const setIsDev = context.setIsDev;

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

  // .............................................................................
  return (
    <div>
      {/* Top Navbar */}
      <div
        class={navbarSty({
          visible: layoutState.topBar.visible,
          dev: isDev(),
        })}
      >
        {props.NavbarContent}
      </div>

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
          <div class="flex-1 p-4 overflow-y-auto">{props.sidebarContent}</div>
        </div>
        {/* Resize Handle */}
        <div
          use:resizeHandle={{
            layoutState,
            setLayoutState,
            minWidth: MIN_WIDTH,
            maxWidth: MAX_WIDTH,
          }}
          class={resizeHandleSty({
            dev: isDev(),
            isVisible: layoutState.drawer.visible,
          })}
        />
      </div>

      {/* Main Content */}
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

      {/*Bottom Mobile Dash*/}
      {props.bottomDash}
    </div>
  );
}

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

export default Layout;
