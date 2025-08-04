import Layout, { useLayoutContext } from ".";
import "./app.css";
import Article from "./views/Article";
import SidebarContent from "./views/SidebarContent";
import NavbarContentView from "./views/Navbar";
import BottomDashView from "./views/BottomDash";
import { BOTTOM_DASH_ONLY_ON_MOBILE } from "./config/constants";

export default function Home() {
  return (
    <main class="h-screen flex flex-col">
      <Layout>
        <Layout.Navbar class="bg-red-300">
          <NavbarWrapper />
        </Layout.Navbar>

        <Layout.Sidebar>
          <SidebarContent />
        </Layout.Sidebar>

        <Layout.Main>
          <Article />
        </Layout.Main>

        <Layout.BottomDash mobileOnly={BOTTOM_DASH_ONLY_ON_MOBILE}>
          <BottomDashWrapper />
        </Layout.BottomDash>
      </Layout>
    </main>
  );
}

// Wrapper components that pass context to the views
function NavbarWrapper() {
  const { layoutState, setLayoutState, isDev, setIsDev } = useLayoutContext();

  return (
    <NavbarContentView
      layoutState={layoutState}
      setLayoutState={setLayoutState}
      isDev={isDev}
      setIsDev={setIsDev}
    />
  );
}

function BottomDashWrapper() {
  const { layoutState, setLayoutState, isDev } = useLayoutContext();

  return (
    <BottomDashView
      layoutState={layoutState}
      setLayoutState={setLayoutState}
      mobileOnly={BOTTOM_DASH_ONLY_ON_MOBILE}
      isDev={isDev()}
    />
  );
}
