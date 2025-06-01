import {
  ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/solid-table";
import { createSignal, For } from "solid-js";
import KaTeX from "../../components/KaTeX";

type Person = {
  firstName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultData: Person[] = Array.from({ length: 100 }, (_, i) => {
  const x = i * 0.1;
  const y = Math.sin(x) * Math.cos(x * 0.5);
  const z = Math.exp(-x * 0.05) * Math.sin(x * 2);

  return {
    firstName: `Point${i + 1}`,
    age: Math.round(x * 10) % 100,
    visits: Math.round(Math.abs(y * 100)),
    status: z > 0 ? "Positive" : z < 0 ? "Negative" : "Zero",
    progress: Math.round(Math.abs(z * 100)),
  };
});

const defaultColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "firstName",
    header: () => <span>Point ID</span>,
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
    enableSorting: true,
  },
  {
    accessorKey: "age",
    header: () => "X Value",
    footer: (info) => info.column.id,
    enableSorting: true,
  },
  {
    accessorKey: "visits",
    header: () => <span>Y Value</span>,
    footer: (info) => info.column.id,
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Z Status",
    footer: (info) => info.column.id,
    enableSorting: true,
  },
  {
    accessorKey: "progress",
    header: "Z Magnitude",
    footer: (info) => info.column.id,
    enableSorting: true,
  },
];

function App() {
  const [data, setData] = createSignal(defaultData);
  const rerender = () => setData(defaultData);

  const table = createSolidTable({
    get data() {
      return data();
    },
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div class="p-6 max-w-6xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Mathematical Data Points
          </h2>
          <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div class="flex items-center space-x-4">
              <span class="font-medium">Equations:</span>
              <KaTeX math="x = i \times 0.1" />
            </div>
            <div class="flex items-center space-x-4 ml-16">
              <KaTeX math="y = \sin(x) \times \cos(0.5x)" />
            </div>
            <div class="flex items-center space-x-4 ml-16">
              <KaTeX math="z = e^{-0.05x} \times \sin(2x)" />
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <For each={table.getHeaderGroups()}>
                {(headerGroup) => (
                  <tr>
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {header.isPlaceholder ? null : (
                            <div
                              class={`flex items-center space-x-1 ${
                                header.column.getCanSort()
                                  ? "cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-100"
                                  : ""
                              }`}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <span>
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                              </span>
                              {header.column.getCanSort() && (
                                <span class="text-gray-400">
                                  {{
                                    asc: "↑",
                                    desc: "↓",
                                  }[header.column.getIsSorted() as string] ??
                                    "↕"}
                                </span>
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
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <For each={table.getRowModel().rows}>
                {(row) => (
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <For each={row.getVisibleCells()}>
                      {(cell) => (
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
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
            <tfoot class="bg-gray-50 dark:bg-gray-700">
              <For each={table.getFooterGroups()}>
                {(footerGroup) => (
                  <tr>
                    <For each={footerGroup.headers}>
                      {(header) => (
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.footer,
                                header.getContext(),
                              )}
                        </th>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tfoot>
          </table>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => rerender()}
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Rerender
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
