import { createSignal, For, onMount, onCleanup, createEffect } from "solid-js";
import Card from "~/components/Card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/CommandPalette";

interface CommandAction {
  id: string;
  title: string;
  description?: string;
  shortcut?: string;
  category: string;
  action: () => void;
}

export default function CommandPaletteDemo() {
  const [open, setOpen] = createSignal(false);
  const [selectedAction, setSelectedAction] = createSignal<string>("");
  let inputRef: HTMLInputElement | undefined;

  // Global keyboard shortcut handler
  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      setOpen(!open());
    }
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  // Add global event listener
  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyDown);
    });
  });

  // Focus the input when command palette opens
  createEffect(() => {
    if (open() && inputRef) {
      inputRef.focus();
    }
  });

  const commands: CommandAction[] = [
    {
      id: "copy",
      title: "Copy",
      description: "Copy selected text to clipboard",
      shortcut: "⌘C",
      category: "Edit",
      action: () => setSelectedAction("Copied text to clipboard"),
    },
    {
      id: "paste",
      title: "Paste",
      description: "Paste from clipboard",
      shortcut: "⌘V",
      category: "Edit",
      action: () => setSelectedAction("Pasted from clipboard"),
    },
    {
      id: "cut",
      title: "Cut",
      description: "Cut selected text",
      shortcut: "⌘X",
      category: "Edit",
      action: () => setSelectedAction("Cut selected text"),
    },
    {
      id: "undo",
      title: "Undo",
      description: "Undo last action",
      shortcut: "⌘Z",
      category: "Edit",
      action: () => setSelectedAction("Undid last action"),
    },
    {
      id: "new-file",
      title: "New File",
      description: "Create a new file",
      shortcut: "⌘N",
      category: "File",
      action: () => setSelectedAction("Created new file"),
    },
    {
      id: "open-file",
      title: "Open File",
      description: "Open an existing file",
      shortcut: "⌘O",
      category: "File",
      action: () => setSelectedAction("Opened file"),
    },
    {
      id: "save-file",
      title: "Save File",
      description: "Save current file",
      shortcut: "⌘S",
      category: "File",
      action: () => setSelectedAction("Saved file"),
    },
    {
      id: "find",
      title: "Find",
      description: "Search in current document",
      shortcut: "⌘F",
      category: "Search",
      action: () => setSelectedAction("Opened find dialog"),
    },
    {
      id: "find-replace",
      title: "Find and Replace",
      description: "Find and replace text",
      shortcut: "⌘H",
      category: "Search",
      action: () => setSelectedAction("Opened find and replace"),
    },
    {
      id: "goto-line",
      title: "Go to Line",
      description: "Jump to specific line number",
      shortcut: "⌘G",
      category: "Navigation",
      action: () => setSelectedAction("Opened go to line dialog"),
    },
    {
      id: "toggle-sidebar",
      title: "Toggle Sidebar",
      description: "Show or hide the sidebar",
      shortcut: "⌘B",
      category: "View",
      action: () => setSelectedAction("Toggled sidebar"),
    },
    {
      id: "zoom-in",
      title: "Zoom In",
      description: "Increase zoom level",
      shortcut: "⌘+",
      category: "View",
      action: () => setSelectedAction("Zoomed in"),
    },
    {
      id: "zoom-out",
      title: "Zoom Out",
      description: "Decrease zoom level",
      shortcut: "⌘-",
      category: "View",
      action: () => setSelectedAction("Zoomed out"),
    },
  ];

  const groupedCommands = () => {
    const groups: Record<string, CommandAction[]> = {};
    commands.forEach((command) => {
      if (!groups[command.category]) {
        groups[command.category] = [];
      }
      groups[command.category].push(command);
    });
    return groups;
  };

  const handleCommand = (command: CommandAction) => {
    command.action();
    setOpen(false);
  };

  return (
    <div class="container mx-auto p-4 space-y-6">
      <Card title="Command Palette Demo">
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button
              onClick={() => setOpen(true)}
              class="px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Open Command Palette
            </button>
            <div class="flex items-center gap-2 text-sm text-base-content/70">
              <kbd class="px-2 py-1 bg-base-200 rounded text-xs">⌘</kbd>
              <kbd class="px-2 py-1 bg-base-200 rounded text-xs">K</kbd>
              <span>to open quickly</span>
            </div>
          </div>

          {selectedAction() && (
            <div class="p-4 bg-success/10 border border-success/20 rounded-md">
              <p class="text-success font-medium">Action executed:</p>
              <p class="text-success/80">{selectedAction()}</p>
            </div>
          )}

          <div class="prose prose-sm max-w-none text-base-content dark:prose-invert">
            <h3>Features</h3>
            <ul>
              <li>Fast fuzzy search across all commands</li>
              <li>Keyboard navigation with arrow keys</li>
              <li>Organized command groups (File, Edit, Search, etc.)</li>
              <li>Keyboard shortcuts displayed</li>
              <li>Professional styling with proper focus states</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Command Palette Modal */}
      {open() && (
        <div class="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/50">
          <div class="w-full max-w-lg mx-4">
            <Command class="rounded-lg border bg-base-100 shadow-lg shadow-black/20">
              <CommandInput
                ref={inputRef}
                placeholder="Type a command or search..."
                class="border-0"
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <For each={Object.entries(groupedCommands())}>
                  {([category, categoryCommands], index) => (
                    <>
                      {index() > 0 && <CommandSeparator />}
                      <CommandGroup heading={category}>
                        <For each={categoryCommands}>
                          {(command) => (
                            <CommandItem
                              value={`${command.title} ${command.description}`}
                              onSelect={() => handleCommand(command)}
                            >
                              <div class="flex flex-col flex-1 gap-1">
                                <div class="font-medium">{command.title}</div>
                                {command.description && (
                                  <div class="text-xs text-base-content/60">
                                    {command.description}
                                  </div>
                                )}
                              </div>
                              {command.shortcut && (
                                <CommandShortcut>{command.shortcut}</CommandShortcut>
                              )}
                            </CommandItem>
                          )}
                        </For>
                      </CommandGroup>
                    </>
                  )}
                </For>
              </CommandList>
            </Command>
          </div>
          <div
            class="fixed inset-0 -z-10"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
