import { createSignal, createMemo, For, Accessor, Component } from "solid-js";
import {
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/solid-table";
import { ChevronUp, ChevronDown } from "lucide-solid";
import { tableStyles } from "./tableStyles";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  enableSorting?: boolean;
  searchPlaceholder?: string;
}

function DataTable<T>(props: DataTableProps<T>): Component {
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = createSignal("");

  const table = createMemo(() =>
    createSolidTable({
      get data() {
        return props.data;
      },
      get columns() {
        return props.columns;
      },
      state: {
        get sorting() {
          return props.enableSorting !== false ? sorting() : [];
        },
        get columnFilters() {
          return props.enableColumnFilters !== false ? columnFilters() : [];
        },
        get globalFilter() {
          return props.enableGlobalFilter !== false ? globalFilter() : "";
        },
      },
      onSortingChange: props.enableSorting !== false ? setSorting : () => {},
      onColumnFiltersChange:
        props.enableColumnFilters !== false ? setColumnFilters : () => {},
      onGlobalFilterChange:
        props.enableGlobalFilter !== false ? setGlobalFilter : () => {},
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel:
        props.enableSorting !== false ? getSortedRowModel() : getCoreRowModel(),
      getFilteredRowModel:
        props.enableGlobalFilter !== false ||
        props.enableColumnFilters !== false
          ? getFilteredRowModel()
          : getCoreRowModel(),
    }),
  );

  const styles = tableStyles();

  return (
    <div class={styles.container()}>
      {props.enableGlobalFilter !== false && (
        <div class={styles.searchContainer()}>
          <input
            value={globalFilter()}
            onInput={(e) => setGlobalFilter(e.currentTarget.value)}
            class={styles.searchInput()}
            placeholder={props.searchPlaceholder || "Search all columns..."}
          />
        </div>
      )}

      <div class={styles.tableWrapper()}>
        <table class={styles.table()}>
          <thead class={styles.thead()}>
            <For each={table().getHeaderGroups()}>
              {(headerGroup) => (
                <tr class={styles.headerRow()}>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th class={styles.headerCell()}>
                        {header.isPlaceholder ? null : (
                          <div>
                            <button
                              class={styles.sortButton()}
                              onClick={header.column.getToggleSortingHandler()}
                              disabled={
                                !header.column.getCanSort() ||
                                props.enableSorting === false
                              }
                            >
                              <span class="font-semibold">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                              </span>
                              {props.enableSorting !== false &&
                                header.column.getIsSorted() === "asc" && (
                                  <ChevronUp size={16} />
                                )}
                              {props.enableSorting !== false &&
                                header.column.getIsSorted() === "desc" && (
                                  <ChevronDown size={16} />
                                )}
                            </button>
                            {props.enableColumnFilters !== false &&
                              header.column.getCanFilter() && (
                                <input
                                  type="text"
                                  value={
                                    (header.column.getFilterValue() as string) ||
                                    ""
                                  }
                                  onInput={(e) =>
                                    header.column.setFilterValue(
                                      e.currentTarget.value,
                                    )
                                  }
                                  placeholder="Filter..."
                                  class={styles.filterInput()}
                                />
                              )}
                          </div>
                        )}
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody class={styles.tbody()}>
            <For each={table().getRowModel().rows}>
              {(row) => (
                <tr class={styles.bodyRow()}>
                  <For each={row.getVisibleCells()}>
                    {(cell) => (
                      <td class={styles.bodyCell()}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      <div class={styles.footer()}>
        Showing {table().getRowModel().rows.length} of {props.data.length} rows
      </div>
    </div>
  );
}

export default DataTable;
