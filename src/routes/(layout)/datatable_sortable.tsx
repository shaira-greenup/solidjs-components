import {
  ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Table,
} from "@tanstack/solid-table";
import { createSignal, For } from "solid-js";
import KaTeX from "../../components/KaTeX";

/**
 * Represents a mathematical data point with calculated values
 */
type MathematicalDataPoint = {
  firstName: string; // Point identifier
  age: number;       // X value (scaled)
  visits: number;    // Y value (calculated from sin/cos)
  status: string;    // Z status (positive/negative/zero)
  progress: number;  // Z magnitude (absolute value)
};

/**
 * Generates mathematical data points using trigonometric functions
 * Equations: x = i × 0.1, y = sin(x) × cos(0.5x), z = e^(-0.05x) × sin(2x)
 */
function generateMathematicalData(): MathematicalDataPoint[] {
  return Array.from({ length: 100 }, (_, i) => {
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
}

/**
 * Column definitions for the mathematical data table
 */
function createTableColumns(): ColumnDef<MathematicalDataPoint>[] {
  return [
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
}

/**
 * Header component displaying the mathematical equations used to generate data
 */
function MathematicalEquationsHeader() {
  return (
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
  );
}

/**
 * Sortable column header with visual sorting indicators
 */
function SortableColumnHeader(props: { header: any }) {
  const { header } = props;
  
  return (
    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
      {header.isPlaceholder ? null : (
        <div
          classList={{
            "flex items-center space-x-1": true,
            "cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-100": header.column.getCanSort()
          }}
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
  );
}

/**
 * Table header section with sortable columns
 */
function DataTableHeader(props: { table: Table<MathematicalDataPoint> }) {
  return (
    <thead class="bg-gray-50 dark:bg-gray-700">
      <For each={props.table.getHeaderGroups()}>
        {(headerGroup) => (
          <tr>
            <For each={headerGroup.headers}>
              {(header) => <SortableColumnHeader header={header} />}
            </For>
          </tr>
        )}
      </For>
    </thead>
  );
}

/**
 * Table body with data rows
 */
function DataTableBody(props: { table: Table<MathematicalDataPoint> }) {
  return (
    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      <For each={props.table.getRowModel().rows}>
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
  );
}

/**
 * Table footer with column information
 */
function DataTableFooter(props: { table: Table<MathematicalDataPoint> }) {
  return (
    <tfoot class="bg-gray-50 dark:bg-gray-700">
      <For each={props.table.getFooterGroups()}>
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
  );
}

/**
 * Complete sortable data table component
 */
function SortableDataTable(props: { 
  data: () => MathematicalDataPoint[], 
  onRerender: () => void 
}) {
  const table = createSolidTable({
    get data() {
      return props.data();
    },
    columns: createTableColumns(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <MathematicalEquationsHeader />
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <DataTableHeader table={table} />
          <DataTableBody table={table} />
          <DataTableFooter table={table} />
        </table>
      </div>

      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={props.onRerender}
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Rerender
        </button>
      </div>
    </div>
  );
}

/**
 * Main application component - Mathematical Data Table with Sorting
 */
function MathematicalDataTableApp() {
  const [data, setData] = createSignal(generateMathematicalData());
  const handleRerender = () => setData(generateMathematicalData());

  return (
    <div class="p-6 max-w-6xl mx-auto">
      <SortableDataTable data={data} onRerender={handleRerender} />
    </div>
  );
}

export default MathematicalDataTableApp;
