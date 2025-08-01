import { createSignal } from "solid-js";
import { tv } from "tailwind-variants";
import { ChevronDown, FileText, Folder, FolderOpen, Plus } from "lucide-solid";

const layout = tv({
  slots: {
    container: [
      // Core layout
      "flex flex-col", 
      "md:flex-row",
      "min-h-screen",
      // Styling
      "bg-base-200"
    ],
    nav: [
      // Core layout
      "md:w-72 md:flex-shrink-0",
      // Styling
      "bg-base-100/90 backdrop-blur-sm",
      "md:bg-base-100 md:backdrop-blur-none",
      "shadow-lg md:shadow-xl"
    ],
    header: [
      // Core layout
      "flex items-center justify-between",
      // Styling
      "p-4 border-b border-base-300",
      // Mobile interaction
      "md:pointer-events-none cursor-pointer"
    ],
    toggle: [
      // Core layout
      "md:hidden flex items-center gap-2",
      // Styling
      "btn btn-ghost btn-sm"
    ],
    chevron: [
      // Core layout & animation
      "transition-transform duration-200"
    ],
    content: [
      // Core layout
      "flex-col",
      "md:flex",
      // Animation
      "max-h-0 md:max-h-none",
      "overflow-hidden md:overflow-visible",
      "transition-all duration-300 ease-in-out",
      // Styling
      "md:p-4"
    ],
    fileTree: [
      // Styling
      "space-y-1"
    ],
    folder: [
      // Styling
      "flex items-center gap-2 px-2 py-1.5 rounded-lg",
      "hover:bg-base-200 cursor-pointer transition-colors"
    ],
    file: [
      // Styling
      "flex items-center gap-2 px-2 py-1.5 ml-4 rounded-lg",
      "hover:bg-base-200 cursor-pointer transition-colors",
      "text-sm text-base-content/80"
    ],
    main: [
      // Core layout
      "flex-1",
      // Styling
      "p-8"
    ],
    newNoteBtn: [
      // Styling
      "btn btn-primary btn-sm gap-2"
    ]
  },
  variants: {
    open: {
      true: {
        content: [
          "max-h-[50vh]",
          "p-4"
        ],
        chevron: "rotate-180"
      }
    }
  }
});

export default function AccordionNavLayout() {
  const [isOpen, setIsOpen] = createSignal(false);
  const [openFolders, setOpenFolders] = createSignal<Set<string>>(new Set(["notes"]));
  const styles = layout();

  const toggleFolder = (folder: string) => {
    setOpenFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folder)) {
        newSet.delete(folder);
      } else {
        newSet.add(folder);
      }
      return newSet;
    });
  };

  return (
    <div class={styles.container()}>
      <nav class={styles.nav()}>
        <div class={styles.header()} onClick={() => setIsOpen(!isOpen())}>
          <button class={styles.newNoteBtn()} onClick={(e) => e.stopPropagation()}>
            <Plus size={16} />
            New Note
          </button>
          <button 
            class={styles.toggle()}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen());
            }}
          >
            Menu
            <ChevronDown size={16} class={styles.chevron({ open: isOpen() })} />
          </button>
        </div>
        
        <div class={styles.content({ open: isOpen() })}>
          <div class={styles.fileTree()}>
            <div 
              class={styles.folder()}
              onClick={() => toggleFolder("notes")}
            >
              {openFolders().has("notes") ? <FolderOpen size={16} /> : <Folder size={16} />}
              <span class="font-medium">Notes</span>
            </div>
            {openFolders().has("notes") && (
              <>
                <div class={styles.file()}>
                  <FileText size={14} />
                  <span>Meeting Notes</span>
                </div>
                <div class={styles.file()}>
                  <FileText size={14} />
                  <span>Project Ideas</span>
                </div>
                <div class={styles.file()}>
                  <FileText size={14} />
                  <span>Quick Thoughts</span>
                </div>
              </>
            )}
            
            <div 
              class={styles.folder()}
              onClick={() => toggleFolder("archive")}
            >
              {openFolders().has("archive") ? <FolderOpen size={16} /> : <Folder size={16} />}
              <span class="font-medium">Archive</span>
            </div>
            {openFolders().has("archive") && (
              <>
                <div class={styles.file()}>
                  <FileText size={14} />
                  <span>Old Notes</span>
                </div>
                <div class={styles.file()}>
                  <FileText size={14} />
                  <span>Completed Tasks</span>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      
      <main class={styles.main()}>
        <div class="prose max-w-none">
          <h1>Welcome to Your Notes</h1>
          <p class="text-base-content/70">
            Select a note from the sidebar or create a new one to get started.
          </p>
          <div class="divider"></div>
          <p>The navigation automatically adapts between mobile and desktop views, providing a seamless experience across all devices.</p>
        </div>
      </main>
    </div>
  );
}