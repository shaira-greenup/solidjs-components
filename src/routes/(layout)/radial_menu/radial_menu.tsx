import { A } from "@solidjs/router";
import Counter from "./Counter";
import RadialMenu from "./RadialMenu";
import { useRadialMenu, MenuItem } from "./useRadialMenu";

export default function Home() {
  const { showMenu, menuPosition, closeMenu, handleContextMenu } = useRadialMenu();

  const menuItems: MenuItem[] = [
    {
      id: 'copy',
      label: 'Copy',
      icon: '📋',
      action: () => alert('Copy action'),
    },
    {
      id: 'paste',
      label: 'Paste',
      icon: '📄',
      action: () => alert('Paste action'),
    },
    {
      id: 'cut',
      label: 'Cut',
      icon: '✂️',
      action: () => alert('Cut action'),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: '🗑️',
      action: () => alert('Delete action'),
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: '✏️',
      action: () => alert('Edit action'),
    },
    {
      id: 'share',
      label: 'Share',
      icon: '🔗',
      action: () => alert('Share action'),
    },
  ];

  return (
    <main
      class="text-center mx-auto text-gray-700 p-4 min-h-screen"
      onContextMenu={handleContextMenu}
    >
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Radial Context Menu</h1>

      <div class="bg-gray-100 rounded-lg p-8 mb-8 max-w-2xl mx-auto">
        <h2 class="text-2xl font-semibold mb-4">Demo Area</h2>
        <p class="text-gray-600 mb-4">
          Right-click anywhere in this area to open the radial context menu.
        </p>
        <div class="bg-white rounded border-2 border-dashed border-gray-300 p-12 min-h-64 flex items-center justify-center">
          <p class="text-gray-500 no-select">Right-click here for radial menu</p>
        </div>
      </div>

      <Counter />
      <p class="mt-8">
        Visit{" "}
        <a href="https://solidjs.com" target="_blank" class="text-sky-600 hover:underline">
          solidjs.com
        </a>{" "}
        to learn how to build Solid apps.
      </p>
      <p class="my-4">
        <span>Home</span>
        {" - "}
        <A href="/about" class="text-sky-600 hover:underline">
          About Page
        </A>{" "}
      </p>

      <RadialMenu
        items={menuItems}
        x={menuPosition().x}
        y={menuPosition().y}
        show={showMenu()}
        onClose={closeMenu}
      />
    </main>
  );
}
