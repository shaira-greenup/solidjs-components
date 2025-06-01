import { ColumnDef } from "@tanstack/solid-table";
import { createSignal } from "solid-js";
import KaTeX from "~/components/KaTeX";
import DataTable from "~/components/DataTable";

/**
 * Represents a mathematical data point with calculated values
 */
type MathematicalDataPoint = {
  firstName: string; // Point identifier
  age: number; // X value (scaled)
  visits: number; // Y value (calculated from sin/cos)
  status: string; // Z status (positive/negative/zero)
  progress: number; // Z magnitude (absolute value)
};

/**
 * Generates mathematical data points using trigonometric functions
 * Equations: x = i × 0.1, y = sin(x) × cos(0.5x), z = e^(-0.05x) × sin(2x)
 */
function generateMathematicalData(): MathematicalDataPoint[] {
  return Array.from({ length: 500 }, (_, i) => {
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
 * Mathematical equations header content
 */
function MathematicalEquationsContent() {
  return (
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
  );
}

/**
 * Main application component - Mathematical Data Table with Sorting and Pagination
 */
function MathematicalDataTableApp() {
  const [data, setData] = createSignal(generateMathematicalData());
  const handleRerender = () => setData(generateMathematicalData());

  return (
    <div class="p-6 max-w-6xl mx-auto">
      <DataTable
        data={data}
        columns={createTableColumns()}
        title="Mathematical Data Points"
        headerContent={<MathematicalEquationsContent />}
        onRerender={handleRerender}
        enableSorting={true}
        enablePagination={true}
        enableKeyboardNavigation={true}
        initialPageSize={20}
        pageSizeOptions={[10, 20, 30, 40, 50]}
      />
    </div>
  );
}

export default MathematicalDataTableApp;
