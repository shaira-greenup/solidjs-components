import { ColumnDef } from "@tanstack/solid-table";
import { createSignal, createMemo } from "solid-js";
import KaTeX from "~/components/KaTeX";
import DataTable from "~/components/DataTable";
import Slider from "~/components/Slider";

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
 * Generates mathematical data points using trigonometric functions with configurable parameters
 * Equations: x = i × xScale, y = sin(x × freq1) × cos(x × freq2), z = e^(-x × decay) × sin(x × freq3)
 */
function generateMathematicalData(
  length: number,
  xScale: number,
  freq1: number,
  freq2: number,
  freq3: number,
  decay: number
): MathematicalDataPoint[] {
  return Array.from({ length }, (_, i) => {
    const x = i * xScale;
    const y = Math.sin(x * freq1) * Math.cos(x * freq2);
    const z = Math.exp(-x * decay) * Math.sin(x * freq3);

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
 * Mathematical equations header content with dynamic parameters
 */
function MathematicalEquationsContent(props: {
  xScale: number;
  freq1: number;
  freq2: number;
  freq3: number;
  decay: number;
}) {
  return (
    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
      <div class="flex items-center space-x-4">
        <span class="font-medium">Equations:</span>
        <KaTeX math={`x = i \\times ${props.xScale}`} />
      </div>
      <div class="flex items-center space-x-4 ml-16">
        <KaTeX math={`y = \\sin(x \\times ${props.freq1}) \\times \\cos(x \\times ${props.freq2})`} />
      </div>
      <div class="flex items-center space-x-4 ml-16">
        <KaTeX math={`z = e^{-x \\times ${props.decay}} \\times \\sin(x \\times ${props.freq3})`} />
      </div>
    </div>
  );
}

/**
 * Control panel with sliders for adjusting mathematical parameters
 */
function ControlPanel(props: {
  length: () => number;
  setLength: (value: number) => void;
  xScale: () => number;
  setXScale: (value: number) => void;
  freq1: () => number;
  setFreq1: (value: number) => void;
  freq2: () => number;
  setFreq2: (value: number) => void;
  freq3: () => number;
  setFreq3: (value: number) => void;
  decay: () => number;
  setDecay: (value: number) => void;
}) {
  return (
    <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Mathematical Parameters
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Slider
          label="Data Length"
          min={10}
          max={1000}
          step={10}
          value={props.length()}
          onChange={props.setLength}
          showValue={true}
          className="space-y-2"
        />
        <Slider
          label="X Scale"
          min={0.01}
          max={1}
          step={0.01}
          value={props.xScale()}
          onChange={props.setXScale}
          showValue={true}
          className="space-y-2"
        />
        <Slider
          label="Frequency 1 (sin)"
          min={0.1}
          max={5}
          step={0.1}
          value={props.freq1()}
          onChange={props.setFreq1}
          showValue={true}
          className="space-y-2"
        />
        <Slider
          label="Frequency 2 (cos)"
          min={0.1}
          max={5}
          step={0.1}
          value={props.freq2()}
          onChange={props.setFreq2}
          showValue={true}
          className="space-y-2"
        />
        <Slider
          label="Frequency 3 (z sin)"
          min={0.1}
          max={5}
          step={0.1}
          value={props.freq3()}
          onChange={props.setFreq3}
          showValue={true}
          className="space-y-2"
        />
        <Slider
          label="Decay Rate"
          min={0.01}
          max={0.2}
          step={0.01}
          value={props.decay()}
          onChange={props.setDecay}
          showValue={true}
          className="space-y-2"
        />
      </div>
    </div>
  );
}

/**
 * Main application component - Dynamic Mathematical Data Table with Interactive Controls
 */
function MathematicalDataTableApp() {
  // Mathematical parameter signals
  const [length, setLength] = createSignal(500);
  const [xScale, setXScale] = createSignal(0.1);
  const [freq1, setFreq1] = createSignal(1.0);
  const [freq2, setFreq2] = createSignal(0.5);
  const [freq3, setFreq3] = createSignal(2.0);
  const [decay, setDecay] = createSignal(0.05);

  // Reactive data generation - automatically updates when parameters change
  const data = createMemo(() => 
    generateMathematicalData(
      length(),
      xScale(),
      freq1(),
      freq2(),
      freq3(),
      decay()
    )
  );

  // Manual rerender function that regenerates with current parameters
  const handleRerender = () => {
    // Force reactivity by updating a parameter slightly and back
    const currentLength = length();
    setLength(currentLength + 1);
    setLength(currentLength);
  };

  return (
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dynamic Mathematical Data Table
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Adjust the mathematical parameters below to see real-time changes in the generated data.
        </p>
      </div>

      <ControlPanel
        length={length}
        setLength={setLength}
        xScale={xScale}
        setXScale={setXScale}
        freq1={freq1}
        setFreq1={setFreq1}
        freq2={freq2}
        setFreq2={setFreq2}
        freq3={freq3}
        setFreq3={setFreq3}
        decay={decay}
        setDecay={setDecay}
      />

      <DataTable
        data={() => data()}
        columns={createTableColumns()}
        title="Mathematical Data Points"
        headerContent={
          <MathematicalEquationsContent
            xScale={xScale()}
            freq1={freq1()}
            freq2={freq2()}
            freq3={freq3()}
            decay={decay()}
          />
        }
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
