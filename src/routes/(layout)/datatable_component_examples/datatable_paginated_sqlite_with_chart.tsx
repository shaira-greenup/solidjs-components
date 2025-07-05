import { ColumnDef } from "@tanstack/solid-table";
import {
  createSignal,
  createResource,
  Suspense,
  createMemo,
  For,
} from "solid-js";
import { action, cache } from "@solidjs/router";
import { ChartConfiguration } from "chart.js";
import KaTeX from "~/components/KaTeX";
import DataTable from "~/components/DataTable";
import ChartComponent from "~/components/Chart";
import Card from "~/components/Card";

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
        <span>
          Measurements: Sepal length/width and Petal length/width (in cm)
        </span>
      </div>
    </div>
  );
}

/**
 * Species filter component
 */
function SpeciesFilter(props: {
  selectedSpecies: () => string;
  setSelectedSpecies: (species: string) => void;
  availableSpecies: () => string[];
}) {
  return (
    <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Filter by Species
      </h3>
      <div class="flex flex-wrap gap-2">
        <button
          onClick={() => props.setSelectedSpecies("all")}
          class={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            props.selectedSpecies() === "all"
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          All Species
        </button>
        <For each={props.availableSpecies()}>
          {(species) => (
            <button
              onClick={() => props.setSelectedSpecies(species)}
              class={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                props.selectedSpecies() === species
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {species}
            </button>
          )}
        </For>
      </div>
    </div>
  );
}

/**
 * Iris data visualization chart
 */
function IrisChart(props: {
  data: () => IrisDataPoint[];
  selectedSpecies: () => string;
}) {
  const chartConfig = createMemo((): ChartConfiguration => {
    const data = props.data();
    const selectedSpecies = props.selectedSpecies();

    // Filter data by selected species
    const filteredData =
      selectedSpecies === "all"
        ? data
        : data.filter((item) => item.species === selectedSpecies);

    // Define colors for each species
    const speciesColors: Record<string, string> = {
      setosa: "rgb(239, 68, 68)", // Red
      versicolor: "rgb(34, 197, 94)", // Green
      virginica: "rgb(59, 130, 246)", // Blue
    };

    // Group data by species for scatter plot
    const datasets =
      selectedSpecies === "all"
        ? Object.keys(speciesColors).map((species) => {
            const speciesData = data.filter((item) => item.species === species);
            return {
              label: species.charAt(0).toUpperCase() + species.slice(1),
              data: speciesData.map((item) => ({
                x: item.sepal_length,
                y: item.sepal_width,
              })),
              backgroundColor: speciesColors[species],
              borderColor: speciesColors[species],
              pointRadius: 4,
              pointHoverRadius: 6,
            };
          })
        : [
            {
              label:
                selectedSpecies.charAt(0).toUpperCase() +
                selectedSpecies.slice(1),
              data: filteredData.map((item) => ({
                x: item.sepal_length,
                y: item.sepal_width,
              })),
              backgroundColor:
                speciesColors[selectedSpecies] || "rgb(107, 114, 128)",
              borderColor:
                speciesColors[selectedSpecies] || "rgb(107, 114, 128)",
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ];

    return {
      type: "scatter",
      data: {
        datasets,
      },
      options: {
        responsive: true,
        animation: false,
        interaction: {
          intersect: false,
          mode: "point",
        },
        plugins: {
          title: {
            display: true,
            text: "Iris Dataset: Sepal Length vs Sepal Width",
          },
          legend: {
            display: true,
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const dataIndex = context.dataIndex;
                const datasetIndex = context.datasetIndex;
                const point =
                  filteredData[
                    selectedSpecies === "all"
                      ? data.findIndex(
                          (item) =>
                            item.sepal_length === context.parsed.x &&
                            item.sepal_width === context.parsed.y &&
                            item.species ===
                              datasets[datasetIndex].label.toLowerCase(),
                        )
                      : dataIndex
                  ];

                if (point) {
                  return [
                    `Species: ${point.species}`,
                    `Sepal Length: ${point.sepal_length} cm`,
                    `Sepal Width: ${point.sepal_width} cm`,
                    `Petal Length: ${point.petal_length} cm`,
                    `Petal Width: ${point.petal_width} cm`,
                  ];
                }
                return "";
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Sepal Length (cm)",
            },
            min: 4,
            max: 8,
          },
          y: {
            title: {
              display: true,
              text: "Sepal Width (cm)",
            },
            min: 1.5,
            max: 4.5,
          },
        },
      },
    };
  });

  return (
    <Card title="Iris Data Visualization" className="mb-6">
      <ChartComponent chartConfig={chartConfig()} className="h-96" />
    </Card>
  );
}

/**
 * Main application component - Iris Dataset Table with SQLite data and Chart
 */
function IrisDataTableApp() {
  const [irisData] = createResource(fetchIrisData);
  const [selectedSpecies, setSelectedSpecies] = createSignal("all");

  // Get unique species from data
  const availableSpecies = createMemo(() => {
    const data = irisData();
    if (!data) return [];
    return [...new Set(data.map((item) => item.species))].sort();
  });

  // Filter data based on selected species
  const filteredData = createMemo(() => {
    const data = irisData();
    if (!data) return [];
    if (selectedSpecies() === "all") return data;
    return data.filter((item) => item.species === selectedSpecies());
  });

  const handleRerender = () => {
    // Refetch data from database
    irisData.refetch();
  };

  return (
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Iris Dataset with Interactive Visualization
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Explore the classic iris dataset with interactive charts and filtering
          by species.
        </p>
      </div>

      <Suspense
        fallback={
          <div class="flex items-center justify-center h-64">
            <div class="text-lg text-gray-600 dark:text-gray-400">
              Loading iris dataset from database...
            </div>
          </div>
        }
      >
        <SpeciesFilter
          selectedSpecies={selectedSpecies}
          setSelectedSpecies={setSelectedSpecies}
          availableSpecies={availableSpecies}
        />

        <IrisChart
          data={() => irisData() || []}
          selectedSpecies={selectedSpecies}
        />

        <DataTable
          data={filteredData}
          columns={createTableColumns()}
          title="Iris Dataset from SQLite Database"
          description={`Showing ${filteredData().length} records${selectedSpecies() !== "all" ? ` for ${selectedSpecies()} species` : ""}`}
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
