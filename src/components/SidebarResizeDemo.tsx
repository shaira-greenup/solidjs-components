import { Show } from "solid-js";
import { useSidebarResize } from "~/composables/useSidebarResize";

export default function SidebarResizeDemo() {
  const { isResizing, sidebarWidth, showResizeHandle } = useSidebarResize();

  return (
    <div class="fixed bottom-4 right-4 bg-[var(--color-base-200)] border border-[var(--color-base-300)] rounded-lg p-4 shadow-lg z-50">
      <h3 class="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
        Sidebar Debug Info
      </h3>
      
      <div class="space-y-2 text-xs">
        <div class="flex items-center gap-2">
          <span class="text-[var(--color-text-secondary)]">Width:</span>
          <span class="font-mono text-[var(--color-text-primary)]">
            {sidebarWidth()}px
          </span>
        </div>
        
        <div class="flex items-center gap-2">
          <span class="text-[var(--color-text-secondary)]">Resizing:</span>
          <div class="flex items-center gap-1">
            <div 
              class="w-2 h-2 rounded-full transition-colors"
              classList={{
                "bg-[var(--color-success)]": !isResizing(),
                "bg-[var(--color-warning)]": isResizing(),
              }}
            />
            <span class="text-[var(--color-text-primary)]">
              {isResizing() ? "Yes" : "No"}
            </span>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <span class="text-[var(--color-text-secondary)]">Handle Visible:</span>
          <span class="text-[var(--color-text-primary)]">
            {showResizeHandle() ? "Yes" : "No"}
          </span>
        </div>
        
        <Show when={isResizing()}>
          <div class="mt-2 p-2 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded text-[var(--color-warning)]">
            🔧 Sidebar is being resized
          </div>
        </Show>
      </div>
    </div>
  );
}