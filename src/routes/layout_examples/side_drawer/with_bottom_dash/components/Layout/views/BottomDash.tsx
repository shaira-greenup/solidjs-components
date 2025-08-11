import Home from "lucide-solid/icons/home";
import Search from "lucide-solid/icons/search";
import Heart from "lucide-solid/icons/heart";
import User from "lucide-solid/icons/user";
import Settings from "lucide-solid/icons/settings";
import Menu from "lucide-solid/icons/menu";
import { bottomDashSty } from "../styles";
import type { LayoutState } from "../types/layout";
import type { SetStoreFunction } from "solid-js/store";
import { Show } from "solid-js";
import { getLayoutContext } from "../LayoutContext";

interface BottomDashProps {
  mobileOnly: boolean;
}

export default function BottomDash(props: BottomDashProps) {
  const iconClass = "w-6 h-6";
  const buttonClass =
    "flex flex-col items-center justify-center flex-1 py-2 text-xs text-gray-600 hover:text-blue-600 transition-colors";

  const ctx = getLayoutContext();

  return (
    <div
      class={bottomDashSty({
        hidden: !ctx.layoutState.bottomDash.visible,
        mobileOnly: props.mobileOnly,
        dev: ctx.isDev(),
      })}
    >
      <div class="flex items-center justify-around h-full px-4">
        <Show when={!ctx.isDev}>
          <button class={buttonClass}>
            <Home class={iconClass} />
            <span class="mt-1">Home</span>
          </button>

          <button class={buttonClass}>
            <Search class={iconClass} />
            <span class="mt-1">Search</span>
          </button>

          <button
            class={buttonClass}
            onclick={() =>
              ctx.setLayoutState(
                "drawer",
                "visible",
                !ctx.layoutState.drawer.visible,
              )
            }
          >
            <Menu class={iconClass} />
            <span class="mt-1">Menu</span>
          </button>

          <button class={buttonClass}>
            <User class={iconClass} />
            <span class="mt-1">Profile</span>
          </button>

          <button class={buttonClass}>
            <Settings class={iconClass} />
            <span class="mt-1">Settings</span>
          </button>
        </Show>
      </div>
    </div>
  );
}
