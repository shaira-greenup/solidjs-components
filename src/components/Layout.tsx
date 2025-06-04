import { createSignal, JSX, onMount } from "solid-js";
import Nav from "./Nav";
import Sidebar from "~/routes/Sidebar";
import SidebarResizeDemo from "./SidebarResizeDemo";

interface LayoutProps {
  children: JSX.Element;
  showDebug?: boolean;
}

export default function Layout(props: LayoutProps) {
  const SIDEBAR_TRIGGER_WIDTH = 1024;
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [sidebarWidth, setSidebarWidth] = createSignal(256); // 16rem = 256px
  const [isDesktop, setIsDesktop] = createSignal(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen());

  const handleSidebarWidthChange = (width: number) => {
    setSidebarWidth(width);
  };

  // Close sidebar on window resize to desktop
  onMount(() => {
    // Set initial desktop state
    setIsDesktop(window.innerWidth >= SIDEBAR_TRIGGER_WIDTH);

    const handleResize = () => {
      const desktop = window.innerWidth >= SIDEBAR_TRIGGER_WIDTH;
      setIsDesktop(desktop);
      if (desktop) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <div class="min-h-screen bg-[--color-base-100]">
      <Sidebar
        isOpen={sidebarOpen}
        toggle={toggleSidebar}
        onWidthChange={handleSidebarWidthChange}
      />

      <div
        class="transition-all duration-300 ease-in-out"
        style={{
          "margin-left": isDesktop() ? `${sidebarWidth()}px` : "0",
        }}
      >
        <Nav sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <main class="flex-1 overflow-x-hidden">
          <div class="p-6">{props.children}</div>
        </main>
      </div>

      {/* Debug component - only show when explicitly enabled */}
      {props.showDebug && <SidebarResizeDemo />}
    </div>
  );
}
