import { createEffect, createSignal, For, JSXElement, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import "./app.css";
import Layout, { MyContext } from "./Layout";
import { LayoutContextProvider } from "./LayoutContext";
import NavbarContent from "./views/Navbar";
import SidebarContent from "./views/SidebarContent";
import Article from "./views/Article";
import BottomDash from "./views/BottomDash";
import { BOTTOM_DASH_ONLY_ON_MOBILE } from "./config/constants";

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
