import {
  ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/solid-table";
import { createVirtualizer } from "@tanstack/solid-virtual";
import {
  createSignal,
  createEffect,
  onMount,
  onCleanup,
  For,
  JSX,
} from "solid-js";
import { isServer } from "solid-js/web";

export interface DataTableScrollKeyboardConfig<T> {
  data: () => T[];
  columns: ColumnDef<T>[];
  title?: string;
  description?: string;
  headerContent?: JSX.Element;
  enableSorting?: boolean;
  onFetchMore?: () => void;
  isFetching?: () => boolean;
  hasMore?: () => boolean;
  totalCount?: () => number;
  className?: string;
  height?: string;
  estimatedRowHeight?: number;
}

/**
 * Table header component for virtualized table with keyboard navigation
 */
function VirtualTableHeaderKeyboard<T>(props: {
  title?: string;
  description?: string;
  headerContent?: JSX.Element;
  totalFetched: () => number;
  totalCount: () => number;
  currentRow: () => number;
  currentCol: () => number;
}) {
  return (
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      {props.title && (
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {props.title}
        </h2>
      )}

      {props.description && (
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {props.description}
        </p>
      )}

      {props.headerContent}

      <div class="mt-4 space-y-2">
        <div class="text-sm text-gray-600 dark:text-gray-300">
          ({props.totalFetched()} of {props.totalCount()} rows loaded)
        </div>
        <div class="text-sm text-blue-600 dark:text-blue-400">
          Current position: Row {props.currentRow() + 1}, Column{" "}
          {props.currentCol() + 1}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Use arrow keys to navigate • Enter to focus cell • Escape to unfocus
        </div>
      </div>
    </div>
  );
}

/**
 * Sortable column header with visual sorting indicators for virtual table
 */
function VirtualSortableColumnHeaderKeyboard<T>(props: {
  header: any;
  isCurrentColumn: () => boolean;
}) {
  const { header } = props;

  return (
    <th
      style={{
        display: "flex",
        width: `${header.getSize()}px`,
        "align-items": "center",
        padding: "12px 24px",
        "background-color": props.isCurrentColumn()
          ? "var(--color-primary, #3b82f6)"
          : "var(--color-base-200, #f8fafc)",
        "border-bottom": "1px solid var(--color-base-300, #e2e8f0)",
        "border-right": "1px solid var(--color-base-300, #e2e8f0)",
      }}
    >
      {header.isPlaceholder ? null : (
        <div
          classList={{
            "flex items-center space-x-1": true,
            "cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-100":
              header.column.getCanSort(),
            "text-white": props.isCurrentColumn(),
          }}
          onClick={header.column.getToggleSortingHandler()}
          style={{
            "font-size": "12px",
            "font-weight": "500",
            "text-transform": "uppercase",
            "letter-spacing": "0.05em",
            color: props.isCurrentColumn()
              ? "white"
              : "var(--color-base-content, #374151)",
          }}
        >
          <span>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </span>
          {header.column.getCanSort() && (
            <span
              class={props.isCurrentColumn() ? "text-white" : "text-gray-400"}
            >
              {{
                asc: "↑",
                desc: "↓",
              }[header.column.getIsSorted() as string] ?? "↕"}
            </span>
          )}
        </div>
      )}
    </th>
  );
}

/**
 * Reusable DataTableScrollKeyboard component with virtualized infinite scrolling and keyboard navigation
 */
export default function DataTableScrollKeyboard<T>(
  props: DataTableScrollKeyboardConfig<T>,
) {
  const {
    data,
    columns,
    title,
    description,
    headerContent,
    enableSorting = true,
    onFetchMore,
    isFetching = () => false,
    hasMore = () => true,
    totalCount = () => data().length,
    className = "",
    height = "600px",
    estimatedRowHeight = 33,
  } = props;

  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [currentRow, setCurrentRow] = createSignal(0);
  const [currentCol, setCurrentCol] = createSignal(0);
  const [isFocused, setIsFocused] = createSignal(false);

  let tableContainerRef: HTMLDivElement | undefined;

  const tableConfig: any = {
    get data() {
      return data();
    },
    columns,
    state: {
      get sorting() {
        return sorting();
      },
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualSorting: true,
  };

  if (enableSorting) {
    tableConfig.getSortedRowModel = getSortedRowModel();
  }

  const table = createSolidTable(tableConfig);

  // Create virtualizer (only on client)
  const rowVirtualizer = createVirtualizer({
    get count() {
      return table.getRowModel().rows.length;
    },
    getScrollElement: () => (isServer ? null : tableContainerRef),
    estimateSize: () => estimatedRowHeight,
    overscan: 5,
  });

  // Ensure current position is within bounds
  createEffect(() => {
    const rows = table.getRowModel().rows;
    const cols = table.getAllColumns().filter((col) => col.getIsVisible());

    if (rows.length > 0 && currentRow() >= rows.length) {
      setCurrentRow(Math.max(0, rows.length - 1));
    }
    if (cols.length > 0 && currentCol() >= cols.length) {
      setCurrentCol(Math.max(0, cols.length - 1));
    }
  });

  // Scroll to current row when it changes (client-only)
  createEffect(() => {
    if (isServer) return;

    const row = currentRow();
    if (isFocused() && row >= 0 && row < table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex(row, { align: "center" });
    }
  });

  // Fetch more data when scrolled near bottom
  const fetchMoreOnBottomReached = (
    containerElement?: HTMLDivElement | null,
  ) => {
    if (containerElement && onFetchMore && hasMore() && !isFetching()) {
      const { scrollHeight, scrollTop, clientHeight } = containerElement;
      if (scrollHeight - scrollTop - clientHeight < 500) {
        onFetchMore();
      }
    }
  };

  // Handle scroll events
  const handleScroll = (e: Event) => {
    fetchMoreOnBottomReached(e.currentTarget as HTMLDivElement);
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isFocused()) return;

    const rows = table.getRowModel().rows;
    const cols = table.getAllColumns().filter((col) => col.getIsVisible());

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        setCurrentRow((prev) => Math.max(0, prev - 1));
        break;
      case "ArrowDown":
        e.preventDefault();
        setCurrentRow((prev) => Math.min(rows.length - 1, prev + 1));
        break;
      case "ArrowLeft":
        e.preventDefault();
        setCurrentCol((prev) => Math.max(0, prev - 1));
        break;
      case "ArrowRight":
        e.preventDefault();
        setCurrentCol((prev) => Math.min(cols.length - 1, prev + 1));
        break;
      case "Home":
        e.preventDefault();
        if (e.ctrlKey) {
          setCurrentRow(0);
          setCurrentCol(0);
        } else {
          setCurrentCol(0);
        }
        break;
      case "End":
        e.preventDefault();
        if (e.ctrlKey) {
          setCurrentRow(rows.length - 1);
          setCurrentCol(cols.length - 1);
        } else {
          setCurrentCol(cols.length - 1);
        }
        break;
      case "PageUp":
        e.preventDefault();
        setCurrentRow((prev) => Math.max(0, prev - 10));
        break;
      case "PageDown":
        e.preventDefault();
        setCurrentRow((prev) => Math.min(rows.length - 1, prev + 10));
        break;
      case "Escape":
        e.preventDefault();
        setIsFocused(false);
        break;
    }
  };

  // Focus management
  const handleTableClick = () => {
    setIsFocused(true);
  };

  const handleTableFocus = () => {
    setIsFocused(true);
  };

  const handleTableBlur = (e: FocusEvent) => {
    // Only blur if focus is moving outside the table container
    if (!tableContainerRef?.contains(e.relatedTarget as Node)) {
      setIsFocused(false);
    }
  };

  // Set up keyboard event listeners (client-only)
  onMount(() => {
    if (isServer) return;

    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
    });
  });

  // Scroll to top when sorting changes (client-only)
  createEffect(() => {
    if (isServer) return;

    const currentSorting = sorting();
    if (currentSorting.length > 0 && table.getRowModel().rows.length > 0) {
      rowVirtualizer.scrollToIndex(0);
      setCurrentRow(0);
    }
  });

  // Check if we need to fetch more data on mount and after data changes (client-only)
  createEffect(() => {
    if (isServer || !tableContainerRef) return;

    fetchMoreOnBottomReached(tableContainerRef);
  });

  return (
    <div
      class={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      <VirtualTableHeaderKeyboard
        title={title}
        description={description}
        headerContent={headerContent}
        totalFetched={() => data().length}
        totalCount={totalCount}
        currentRow={currentRow}
        currentCol={currentCol}
      />

      <div
        ref={tableContainerRef}
        onScroll={handleScroll}
        onClick={handleTableClick}
        onFocus={handleTableFocus}
        onBlur={handleTableBlur}
        tabIndex={0}
        style={{
          overflow: "auto",
          position: "relative",
          height: height,
          outline: isFocused()
            ? "2px solid var(--color-primary, #3b82f6)"
            : "none",
        }}
        class="border-t border-gray-200 dark:border-gray-700 focus:outline-none"
      >
        <table style={{ display: "grid" }}>
          <thead
            style={{
              display: "grid",
              position: "sticky",
              top: "0",
              "z-index": "1",
            }}
          >
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr style={{ display: "flex", width: "100%" }}>
                  <For each={headerGroup.headers}>
                    {(header, index) => (
                      <VirtualSortableColumnHeaderKeyboard
                        header={header}
                        isCurrentColumn={() =>
                          isFocused() && index() === currentCol()
                        }
                      />
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody
            style={{
              display: "grid",
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            <For each={rowVirtualizer.getVirtualItems()}>
              {(virtualRow) => {
                const row = table.getRowModel().rows[virtualRow.index];
                const isCurrentRow = () =>
                  isFocused() && virtualRow.index === currentRow();

                return (
                  <tr
                    data-index={virtualRow.index}
                    style={{
                      display: "flex",
                      position: "absolute",
                      transform: `translateY(${virtualRow.start}px)`,
                      width: "100%",
                    }}
                    classList={{
                      "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors":
                        !isCurrentRow(),
                      "bg-blue-50 dark:bg-blue-900/30": isCurrentRow(),
                    }}
                  >
                    <For each={row.getVisibleCells()}>
                      {(cell, cellIndex) => {
                        const isCurrentCell = () =>
                          isFocused() &&
                          virtualRow.index === currentRow() &&
                          cellIndex() === currentCol();

                        return (
                          <td
                            style={{
                              display: "flex",
                              width: `${cell.column.getSize()}px`,
                              "align-items": "center",
                              padding: "12px 24px",
                              "border-bottom":
                                "1px solid var(--color-base-300, #e2e8f0)",
                              "border-right":
                                "1px solid var(--color-base-300, #e2e8f0)",
                              "background-color": isCurrentCell()
                                ? "var(--color-primary, #3b82f6)"
                                : "transparent",
                            }}
                            classList={{
                              "text-sm text-gray-900 dark:text-gray-100":
                                !isCurrentCell(),
                              "text-sm text-white font-medium": isCurrentCell(),
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        );
                      }}
                    </For>
                  </tr>
                );
              }}
            </For>
          </tbody>
        </table>
      </div>

      {isFetching() && (
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-center">
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Loading more data...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
