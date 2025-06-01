import { ColumnDef } from "@tanstack/solid-table";
import { createSignal, createResource, Suspense } from "solid-js";
import { action, cache } from "@solidjs/router";
import KaTeX from "~/components/KaTeX";
import DataTable from "~/components/DataTable";

/**
 * Represents an iris data point from the database
 */
type IrisDataPoint = {
  sepal_length: number;
  sepal_width: number;
  petal_length: number;
  petal_width: number;
  species: string;
};

/**
 * Server-side function to read iris data from SQLite database
 */
const fetchIrisData = cache(async (): Promise<IrisDataPoint[]> => {
  "use server";
  
  const { default: Database } = await import("better-sqlite3");
  const { resolve } = await import("path");
  
  try {
    const dbPath = resolve("src/data/iris.db");
    const db = new Database(dbPath, { readonly: true });
    
    const stmt = db.prepare("SELECT * FROM iris");
    const rows = stmt.all();
    
    db.close();
    
    return rows as IrisDataPoint[];
  } catch (error) {
    console.error("Error reading iris database:", error);
    return [];
  }
}, "iris-data");

/**
 * Column definitions for the iris data table
 */
function createTableColumns(): ColumnDef<IrisDataPoint>[] {
  return [
    {
      accessorKey: "sepal_length",
      header: () => <span>Sepal Length</span>,
      cell: (info) => Number(info.getValue()).toFixed(1),
      footer: (info) => info.column.id,
      enableSorting: true,
    },
    {
      accessorKey: "sepal_width",
      header: () => <span>Sepal Width</span>,
      cell: (info) => Number(info.getValue()).toFixed(1),
      footer: (info) => info.column.id,
      enableSorting: true,
    },
    {
      accessorKey: "petal_length",
      header: () => <span>Petal Length</span>,
      cell: (info) => Number(info.getValue()).toFixed(1),
      footer: (info) => info.column.id,
      enableSorting: true,
    },
    {
      accessorKey: "petal_width",
      header: () => <span>Petal Width</span>,
      cell: (info) => Number(info.getValue()).toFixed(1),
      footer: (info) => info.column.id,
      enableSorting: true,
    },
    {
      accessorKey: "species",
      header: () => <span>Species</span>,
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      enableSorting: true,
    },
  ];
}

/**
 * Iris dataset information header content
 */
function IrisDatasetContent() {
  return (
    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
      <div class="flex items-center space-x-4">
        <span class="font-medium">Dataset:</span>
        <span>The famous Iris flower dataset by Ronald Fisher (1936)</span>
      </div>
      <div class="flex items-center space-x-4 ml-16">
        <span>Contains measurements of 150 iris flowers from 3 species</span>
      </div>
      <div class="flex items-center space-x-4 ml-16">
        <span>Species: Setosa, Versicolor, and Virginica</span>
      </div>
      <div class="flex items-center space-x-4 ml-16">
        <span>Measurements: Sepal length/width and Petal length/width (in cm)</span>
      </div>
    </div>
  );
}

/**
 * Main application component - Iris Dataset Table with SQLite data
 */
function IrisDataTableApp() {
  const [irisData] = createResource(fetchIrisData);
  
  const handleRerender = () => {
    // Refetch data from database
    irisData.refetch();
  };

  return (
    <div class="p-6 max-w-6xl mx-auto">
      <Suspense fallback={
        <div class="flex items-center justify-center h-64">
          <div class="text-lg text-gray-600 dark:text-gray-400">
            Loading iris dataset from database...
          </div>
        </div>
      }>
        <DataTable
          data={() => irisData() || []}
          columns={createTableColumns()}
          title="Iris Dataset from SQLite Database"
          description="Classic machine learning dataset loaded from SQLite database"
          headerContent={<IrisDatasetContent />}
          onRerender={handleRerender}
          enableSorting={true}
          enablePagination={true}
          enableKeyboardNavigation={true}
          initialPageSize={20}
          pageSizeOptions={[10, 20, 30, 40, 50]}
        />
      </Suspense>
    </div>
  );
}

export default IrisDataTableApp;
