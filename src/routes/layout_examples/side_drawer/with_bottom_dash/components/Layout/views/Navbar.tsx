import ApplicationGridIcon from "../icons/ApplicationGrid";
import { getLayoutContext } from "../LayoutContext";
import { buttonSty } from "../styles";

export default function NavbarContent() {
  // Get the necessary layout context
  const context = getLayoutContext();
  const layoutState = context.layoutState;
  const setLayoutState = context.setLayoutState;
  const isDev = context.isDev;
  const setIsDev = context.setIsDev;

  return (
    <div class="h-full flex justify-center md:justify-start">
      <button
        class={buttonSty()}
        onclick={() => {
          setLayoutState("drawer", "visible", !layoutState.drawer.visible);
        }}
      >
        {/* Application grid icon */}
        <ApplicationGridIcon isActive={layoutState.drawer.visible} />
        <span class="text-white text-sm font-medium select-none">
          Applications
        </span>
      </button>

      {/* DEV Mode Toggle Button */}
      <button
        class="ml-auto px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
        onclick={() => setIsDev(!isDev())}
      >
        DEV: {isDev() ? "ON" : "OFF"}
      </button>
    </div>
  );
}
