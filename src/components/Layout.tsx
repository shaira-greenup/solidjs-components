import Resizable from "@corvu/resizable";
import { JSX } from "solid-js";

interface LayoutProps {
  sidebar: JSX.Element;
  children: JSX.Element;
}

export default function Layout(props: LayoutProps) {
  return (
    <div class="h-screen bg-gray-50 dark:bg-gray-900">
      <Resizable class="size-full">
        {/* Left Sidebar */}
        <Resizable.Panel
          initialSize={0.25}
          minSize={0.15}
          maxSize={0.4}
          class="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm"
        >
          {props.sidebar}
        </Resizable.Panel>
        
        {/* Resizer Handle */}
        <Resizable.Handle
          aria-label="Resize sidebar"
          class="group basis-1 hover:basis-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-300 dark:hover:bg-blue-600 transition-all duration-200 cursor-col-resize"
        >
          <div class="size-full relative before:absolute before:inset-0 before:-inset-x-2 before:content-['']" />
        </Resizable.Handle>

        {/* Main Content Area */}
        <Resizable.Panel
          initialSize={0.75}
          minSize={0.6}
          class="bg-white dark:bg-gray-800"
        >
          {props.children}
        </Resizable.Panel>
      </Resizable>
    </div>
  );
}