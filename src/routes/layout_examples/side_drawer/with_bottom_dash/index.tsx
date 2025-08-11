import { createEffect, createSignal, For, JSXElement, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { LayoutContextProvider } from "./components/Layout/LayoutContext";
import Layout from "./components/Layout/Layout";
import NavbarContent from "./components/Layout/views/Navbar";
import SidebarContent from "./components/Layout/views/SidebarContent";
import BottomDash from "./components/Layout/views/BottomDash";
import { BOTTOM_DASH_ONLY_ON_MOBILE } from "./components/Layout/config/constants";
import Article from "./views/Article";

export default function Home() {
  return (
    <main class="h-screen flex flex-col">
      <LayoutContextProvider>
        <Layout
          NavbarContent={<NavbarContent />}
          sidebarContent={<SidebarContent />}
          bottomDash={<BottomDash mobileOnly={BOTTOM_DASH_ONLY_ON_MOBILE} />}
        >
          <Article />
        </Layout>
      </LayoutContextProvider>
    </main>
  );
}
