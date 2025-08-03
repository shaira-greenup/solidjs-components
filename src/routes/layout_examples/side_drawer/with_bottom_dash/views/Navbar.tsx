import { buttonSty, navbarSty } from "../styles";
import ApplicationGridIcon from "../components/icons/ApplicationGrid";
import type { SetStoreFunction } from "solid-js/store";
import type { LayoutState } from "../types/layout";
import type { Accessor } from "solid-js";

interface NavbarProps {
  layoutState: LayoutState;
  setLayoutState: SetStoreFunction<LayoutState>;
  isDev: Accessor<boolean>;
  setIsDev: (value: boolean) => void;
}

export default function NavbarContent(props: NavbarProps) {
  return (
      <div class="h-full flex justify-center md:justify-start">
        <button
          class={buttonSty()}
          onclick={() => {
            props.setLayoutState("drawer", "visible", !props.layoutState.drawer.visible);
          }}
        >
          {/* Application grid icon */}
          <ApplicationGridIcon isActive={props.layoutState.drawer.visible} />
          <span class="text-white text-sm font-medium select-none">
            Applications
          </span>
        </button>

        {/* DEV Mode Toggle Button */}
        <button
          class="ml-auto px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          onclick={() => props.setIsDev(!props.isDev())}
        >
          DEV: {props.isDev() ? "ON" : "OFF"}
        </button>
      </div>
  );
}
