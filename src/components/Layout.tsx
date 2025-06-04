import { createSignal, JSX, onMount } from "solid-js";
import Nav from "./Nav";
import Sidebar from "~/routes/Sidebar";

interface LayoutProps {
  children: JSX.Element;
}

export default function Layout(props: LayoutProps) {
  const SIDEBAR_TRIGGER_WIDTH = 1024;
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen());

  // Close sidebar on window resize to desktop
  onMount(() => {
    const handleResize = () => {
      if (window.innerWidth >= SIDEBAR_TRIGGER_WIDTH) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <div class="min-h-screen bg-[--color-base-100]">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />

      <div class="lg:ml-[var(--sidebar-width)]">
        <Nav sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <main class="flex-1 overflow-x-hidden">
          <div class="p-6">{props.children}</div>
        </main>
      </div>
    </div>
  );
}
