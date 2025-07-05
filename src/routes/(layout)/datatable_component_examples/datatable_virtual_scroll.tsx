import { ColumnDef } from "@tanstack/solid-table";
import { createSignal, createEffect } from "solid-js";
import DataTableScroll from "~/components/DataTableScroll";

/**
 * Represents a person data point for infinite scrolling demo
 */
type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
  createdAt: Date;
};

/**
 * Simulates API response structure
 */
type PersonApiResponse = {
  data: Person[];
  meta: {
    totalRowCount: number;
  };
};

/**
 * Generate random person data
 */
function generatePersonData(start: number, size: number): Person[] {
  const statuses = ["Single", "In Relationship", "Complicated", "Married"];

  return Array.from({ length: size }, (_, i) => {
    const id = start + i;
    return {
      id,
      firstName: `First${id}`,
      lastName: `Last${id}`,
      age: Math.floor(Math.random() * 80) + 18,
      visits: Math.floor(Math.random() * 1000),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      progress: Math.floor(Math.random() * 100),
      createdAt: new Date(
        Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365,
      ),
    };
  });
}

/**
 * Simulate API call with delay
 */
async function fetchData(
  start: number,
  size: number,
): Promise<PersonApiResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const data = generatePersonData(start, size);

  return {
    data,
    meta: {
      totalRowCount: 10000, // Simulate large dataset
    },
  };
}

/**
 * Column definitions for the person data table
 */
function createPersonColumns(): ColumnDef<Person>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      size: 80,
      enableSorting: true,
    },
    {
      accessorKey: "firstName",
      header: "First Name",
      size: 150,
      enableSorting: true,
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      size: 150,
      enableSorting: true,
    },
    {
      accessorKey: "age",
      header: "Age",
      size: 80,
      enableSorting: true,
    },
    {
      accessorKey: "visits",
      header: "Visits",
      size: 100,
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 150,
      enableSorting: true,
    },
    {
      accessorKey: "progress",
      header: "Progress",
      size: 120,
      cell: (info) => `${info.getValue()}%`,
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      size: 200,
      cell: (info) => (info.getValue() as Date).toLocaleDateString(),
      enableSorting: true,
    },
  ];
}

/**
 * Header content explaining the virtual scrolling demo
 */
function VirtualScrollContent() {
  return (
    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
      <div class="flex items-center space-x-4">
        <span class="font-medium">Demo:</span>
        <span>
          Virtualized infinite scrolling with 10,000 simulated records
        </span>
      </div>
      <div class="flex items-center space-x-4 ml-16">
        <span>Scroll down to automatically load more data</span>
      </div>
      <div class="flex items-center space-x-4 ml-16">
        <span>Only visible rows are rendered for optimal performance</span>
      </div>
    </div>
  );
}

/**
 * Main application component - Virtual Scrolling Data Table
 */
function VirtualScrollDataTableApp() {
  const [allData, setAllData] = createSignal<Person[]>([]);
  const [isFetching, setIsFetching] = createSignal(false);
  const [totalCount, setTotalCount] = createSignal(10000);
  const [hasMore, setHasMore] = createSignal(true);

  const fetchSize = 50;

  // Load initial data
  createEffect(async () => {
    setIsFetching(true);
    try {
      const response = await fetchData(0, fetchSize);
      setAllData(response.data);
      setTotalCount(response.meta.totalRowCount);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    } finally {
      setIsFetching(false);
    }
  });

  // Function to fetch more data
  const fetchMore = async () => {
    if (isFetching() || !hasMore()) return;

    setIsFetching(true);
    try {
      const currentLength = allData().length;
      const response = await fetchData(currentLength, fetchSize);

      setAllData((prev) => [...prev, ...response.data]);

      // Check if we've reached the end
      if (currentLength + response.data.length >= response.meta.totalRowCount) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch more data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div class="p-6 max-w-7xl mx-auto">
      <DataTableScroll
        data={allData}
        columns={createPersonColumns()}
        title="Virtual Scrolling Data Table"
        description="Efficiently handles large datasets with virtualized rendering and infinite scrolling"
        headerContent={<VirtualScrollContent />}
        onFetchMore={fetchMore}
        isFetching={isFetching}
        hasMore={hasMore}
        totalCount={totalCount}
        enableSorting={true}
        height="600px"
        estimatedRowHeight={45}
      />
    </div>
  );
}

export default VirtualScrollDataTableApp;
