import { createEffect, onMount } from "solid-js";
import { LayoutState } from "../types/layout";

export function syncCssVars(layoutState: LayoutState) {

  onMount(() => {
    createEffect(() => {
      document.documentElement.style.setProperty(
        "--spacing-sidebar_width",
        `${layoutState.drawer.width}px`,
      );
    });
  });

};
