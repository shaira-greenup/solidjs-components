import { createSignal, For } from "solid-js";
import { tv } from "tailwind-variants";
import { ChevronDown, FileText, Folder, FolderOpen, Plus } from "lucide-solid";

// Generate deep nested file structure
function generateFileStructure() {
  let id = 0;
  const genItem = (name: string, depth = 0): any => ({
    id: `${id++}`,
    name,
    type: depth > 3 ? "file" : "folder",
    children: depth > 3 ? undefined : Array.from(
      { length: 3 + Math.floor(Math.random() * 4) }, 
      (_, i) => genItem(`${name}_${depth > 2 ? 'file' : 'sub'}_${i}.tsx`, depth + 1)
    )
  });
  
  return ["Components", "Pages", "Services", "Utils", "Hooks", "Types", "Styles", "Tests", "Config", "Assets"]
    .map(name => genItem(name));
}

const layout = tv({
  slots: {
    container: [
      // Core grid layout that animates smoothly
      "grid min-h-screen",
      "grid-cols-1 md:grid-cols-[18rem_1fr]",
      "grid-rows-[auto_1fr] md:grid-rows-1",
      "transition-all duration-500 ease-in-out",
      "bg-base-200"
    ],
    nav: [
      // Grid positioning
      "row-span-1 md:row-span-2",
      "transition-all duration-500 ease-in-out",
      // Styling
      "bg-base-100/90 backdrop-blur-sm",
      "md:bg-base-100 md:backdrop-blur-none",
      "shadow-lg md:shadow-xl"
    ],
    header: [
      "flex items-center justify-between",
      "p-4 border-b border-base-300",
      "md:pointer-events-none cursor-pointer"
    ],
    toggle: [
      "md:hidden flex items-center gap-2",
      "btn btn-ghost btn-sm"
    ],
    chevron: [
      "transition-transform duration-200"
    ],
    content: [
      "grid grid-rows-[0fr] md:grid-rows-[1fr]",
      "transition-[grid-template-rows] duration-300 ease-in-out"
    ],
    contentInner: [
      "overflow-hidden"
    ],
    fileTree: [
      "space-y-1 p-4",
      "overflow-y-auto",
      "max-h-[50vh] md:max-h-[calc(100vh-8rem)]"
    ],
    main: [
      "p-8 transition-all duration-500 ease-in-out"
    ],
    newNoteBtn: [
      "btn btn-primary btn-sm gap-2"
    ]
  },
  variants: {
    open: {
      true: {
        content: "grid-rows-[1fr]",
        chevron: "rotate-180"
      }
    }
  }
});

export default function AccordionNavLayout() {
  const [isOpen, setIsOpen] = createSignal(false);
  const [openFolders, setOpenFolders] = createSignal<Set<string>>(new Set());
  const [fileStructure] = createSignal(generateFileStructure());
  const styles = layout();

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => {
      const newSet = new Set(prev);
      newSet.has(folderId) ? newSet.delete(folderId) : newSet.add(folderId);
      return newSet;
    });
  };

  // Recursive component to render file tree
  const FileTreeItem = (props: { item: any; depth: number }) => {
    const indent = { "padding-left": `${props.depth}rem` };
    
    return props.item.type === "file" ? (
      <div class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-base-200 cursor-pointer text-sm text-base-content/80" style={indent}>
        <FileText size={14} />
        <span>{props.item.name}</span>
      </div>
    ) : (
      <>
        <div 
          class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-base-200 cursor-pointer" 
          style={indent}
          onClick={() => toggleFolder(props.item.id)}
        >
          {openFolders().has(props.item.id) ? <FolderOpen size={16} /> : <Folder size={16} />}
          <span class="font-medium">{props.item.name}</span>
        </div>
        {openFolders().has(props.item.id) && (
          <For each={props.item.children}>
            {(child) => <FileTreeItem item={child} depth={props.depth + 1} />}
          </For>
        )}
      </>
    );
  };

  return (
    <div class={styles.container()}>
      <nav class={styles.nav()}>
        <div class={styles.header()} onClick={() => setIsOpen(!isOpen())}>
          <button class={styles.newNoteBtn()} onClick={(e) => e.stopPropagation()}>
            <Plus size={16} />
            New Note
          </button>
          <button class={styles.toggle()} onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen()); }}>
            Menu
            <ChevronDown size={16} class={styles.chevron({ open: isOpen() })} />
          </button>
        </div>
        
        <div class={styles.content({ open: isOpen() })}>
          <div class={styles.contentInner()}>
            <div class={styles.fileTree()}>
              <For each={fileStructure()}>
                {(item) => <FileTreeItem item={item} depth={0} />}
              </For>
            </div>
          </div>
        </div>
      </nav>
      
      <main class={styles.main()}>
        <div class="prose max-w-none">
          <h1>Dynamic File Explorer</h1>
          <p class="text-base-content/70">
            Explore the dynamically generated file structure with nested folders and files.
          </p>
          <div class="divider"></div>
          <p>The navigation smoothly animates between mobile and desktop layouts as you resize the window.</p>
        </div>
      </main>
    </div>
  );
}
