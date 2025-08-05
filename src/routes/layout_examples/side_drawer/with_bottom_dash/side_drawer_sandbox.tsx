import Layout from ".";
import "./app.css";
import { getLayoutContext } from "./contextTypes";
import Article from "./views/Article";
import NavbarContent from "./views/Navbar";
import SidebarContent from "./views/SidebarContent";
export default function Home() {
  return (
    <main class="h-screen flex flex-col">
      <Layout>
        <Layout.Navbar>
          <NavbarView />
        </Layout.Navbar>
        <Layout.Sidebar>
          <SidebarView />
        </Layout.Sidebar>
        <Layout.MainArea>
          <Article />
        </Layout.MainArea>
        <Layout.BottomDash></Layout.BottomDash>
      </Layout>
    </main>
  );
}

const NavbarView = () => {
  const { layoutState, setLayoutState, isDev, setIsDev } = getLayoutContext();

  return (
    <NavbarContent
      layoutState={layoutState}
      setLayoutState={setLayoutState}
      isDev={isDev}
      setIsDev={setIsDev}
    />
  );
};

const SidebarView = () => {
  return (
    <div class="flex flex-col h-full">
      <div class="flex-1 p-4 overflow-y-auto">
        <SidebarContent />
      </div>
    </div>
  );
};


// TODO Sidebar needs class for Overlay?
